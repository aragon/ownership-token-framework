/**
 * Handlers for the canonical token JSON API. Kept separate from the route
 * files so they are directly unit-testable; routes are thin wrappers.
 *
 * Response contract (consumed by the app, future APP-796 agents, and
 * external partners):
 *   { data: <read model>, provenance: { snapshot_id, commit_ref, published_at, source } }
 *
 * NOTE: the route parameter is the token `id` (lowercase, e.g. "ldo") —
 * matching generated/tokens/<id>.json and the existing /tokens/$tokenId page
 * route. APP-796's "{symbol}" wording resolves to this id (symbols lowercase
 * to ids for all current tokens).
 */
import {
  getProvenance,
  getPublishedFaq,
  getPublishedFramework,
  getPublishedIndex,
  getPublishedTokenDoc,
} from "@/lib/server/published-data"

// The published data is immutable for the life of a deploy (composed at build
// time and content-hashed). Hosts purge their edge cache on each new deploy, so
// we cache hard: after the first hit per edge node the CDN serves every
// subsequent request and the function is never invoked. A request flood is
// absorbed by the CDN, not paid for at the origin — this is the primary DoS
// posture for a read-only API (see .tempor/docs/operations/api-hardening.md).
const CACHE_OK =
  "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800"
// Misses (unknown ids) are cached briefly so a repeated bogus id can't hammer
// the function; short because an id can become valid on the next deploy.
const CACHE_MISS = "public, max-age=30, s-maxage=60"

function jsonResponse(
  body: unknown,
  status = 200,
  cacheControl = CACHE_OK
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
      // Public, read-only data with no credentials — a wildcard origin is safe
      // and keeps CORS from being a footgun for consumers.
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      // Never let a client sniff the response into another content type.
      "X-Content-Type-Options": "nosniff",
    },
  })
}

/** Cheap CORS preflight / method probe — no body, cacheable. */
export function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": CACHE_OK,
    },
  })
}

/**
 * Reject non-GET methods with a cheap 405 instead of letting them fall through
 * to the SSR shell — an uncacheable HTML render is a far more expensive (and
 * cache-bypassing) thing to serve a flood than a one-line 405.
 */
export function handleMethodNotAllowed(): Response {
  return new Response(
    JSON.stringify({
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET is supported." },
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        Allow: "GET, OPTIONS",
        "Cache-Control": CACHE_MISS,
      },
    }
  )
}

/** GET /api/v1/tokens — the published index (discovery + cross-token queries). */
export function handleGetTokens(): Response {
  return jsonResponse({
    data: getPublishedIndex(),
    provenance: getProvenance(),
  })
}

/** GET /api/v1/framework — canonical metric/criteria definitions + anchors. */
export function handleGetFramework(): Response {
  return jsonResponse({
    data: getPublishedFramework(),
    provenance: getProvenance(),
  })
}

/** GET /api/v1/faq — published framework/methodology Q&A. */
export function handleGetFaq(): Response {
  return jsonResponse({
    data: getPublishedFaq(),
    provenance: getProvenance(),
  })
}

/** GET /api/v1/tokens/{id} — one composed token doc (the per-token reusable unit). */
export function handleGetToken(tokenId: string): Response {
  const doc = getPublishedTokenDoc(tokenId)
  if (!doc) {
    return jsonResponse(
      {
        error: {
          code: "TOKEN_NOT_FOUND",
          message: `No published token with id "${tokenId.trim().toLowerCase()}"`,
        },
      },
      404,
      CACHE_MISS
    )
  }
  return jsonResponse({ data: doc, provenance: getProvenance() })
}
