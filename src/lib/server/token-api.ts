/**
 * Handlers for the canonical token JSON API. Kept separate from the route
 * files so they are directly unit-testable; routes are thin wrappers.
 *
 * Response contract (consumed by the app, future APP-796 agents, and
 * external partners):
 *   { data: <read model>, provenance: { snapshot_id, commit_ref, last_updated, published_at, source } }
 *
 * NOTE: the route parameter is the token `id` (lowercase, e.g. "ldo") —
 * matching generated/tokens/<id>.json and the existing /tokens/$tokenId page
 * route. APP-796's "{symbol}" wording resolves to this id (symbols lowercase
 * to ids for all current tokens).
 */
import {
  getFaq,
  getFramework,
  getIndex,
  getProvenance,
  getTokenDoc,
  isReleaseEnabled,
} from "@/lib/server/published-source"

// Cache posture depends on the data source.
// - Committed / build-from-ref data is immutable for the life of the deploy, so
//   we cache hard at the edge: after the first hit per edge node the CDN serves
//   everything and the function is never invoked — a flood is absorbed by the
//   CDN, the primary DoS posture (see .tempor/docs/operations/api-hardening.md).
// - In release mode the data can change WITHOUT a deploy (a new GitHub Release),
//   so a day-long edge cache would serve a stale snapshot. We cap it near the
//   source's revalidation window so a new snapshot propagates in ~a minute,
//   still mostly CDN-absorbed. (Eventual upgrade: a publish→app purge webhook —
//   instant propagation while keeping the long cache.)
const CACHE_OK = isReleaseEnabled()
  ? "public, max-age=30, s-maxage=60, stale-while-revalidate=60"
  : "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800"
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
export async function handleGetTokens(): Promise<Response> {
  const [data, provenance] = await Promise.all([getIndex(), getProvenance()])
  return jsonResponse({ data, provenance })
}

/** GET /api/v1/framework — canonical metric/criteria definitions + anchors. */
export async function handleGetFramework(): Promise<Response> {
  const [data, provenance] = await Promise.all([
    getFramework(),
    getProvenance(),
  ])
  return jsonResponse({ data, provenance })
}

/** GET /api/v1/faq — published framework/methodology Q&A. */
export async function handleGetFaq(): Promise<Response> {
  const [data, provenance] = await Promise.all([getFaq(), getProvenance()])
  return jsonResponse({ data, provenance })
}

/** GET /api/v1/tokens/{id} — one composed token doc (the per-token reusable unit). */
export async function handleGetToken(tokenId: string): Promise<Response> {
  const doc = await getTokenDoc(tokenId)
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
  return jsonResponse({ data: doc, provenance: await getProvenance() })
}
