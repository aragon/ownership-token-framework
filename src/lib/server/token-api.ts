/**
 * Handlers for the canonical token JSON API; routes are thin wrappers over
 * these (kept here so they stay directly unit-testable).
 *
 * Response contract: { data: <read model>, provenance }.
 *
 * The route param is the token `id` (lowercase, e.g. "ldo"), matching
 * generated/tokens/<id>.json. APP-796's "{symbol}" resolves to this id
 * (symbols lowercase to ids for all current tokens).
 */
import type { Provenance } from "@/lib/schemas"
import { buildOpenApiDocument } from "@/lib/server/openapi"
import {
  getFaq,
  getFramework,
  getIndex,
  getProvenance,
  getTokenDoc,
  isReleaseEnabled,
} from "@/lib/server/published-source"

// Cache posture depends on the data source; CDN absorption is the primary DoS
// posture (see .tempor/docs/operations/api-hardening.md).
// - Committed data is immutable for the life of the deploy → cache hard.
// - Release mode data can change WITHOUT a deploy (a new GitHub Release), so a
//   long edge cache would serve a stale snapshot; cap near the source's
//   revalidation window so a new snapshot propagates in ~a minute.
// TODO: publish→app purge webhook for instant propagation + a long cache.
const CACHE_OK = isReleaseEnabled()
  ? "public, max-age=30, s-maxage=60, stale-while-revalidate=60"
  : "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800"
// Briefly cached so a bogus id can't hammer the function; short because an
// unknown id can become valid on the next deploy.
const CACHE_MISS = "public, max-age=30, s-maxage=60"

function baseHeaders(cacheControl: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Cache-Control": cacheControl,
    // Public, read-only, credential-less data → wildcard origin is safe.
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "X-Content-Type-Options": "nosniff",
  }
}

function jsonResponse(
  body: unknown,
  status = 200,
  cacheControl = CACHE_OK
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: baseHeaders(cacheControl),
  })
}

/**
 * Strong validator: every 200 body is fully determined by its snapshot, so the
 * snapshot_id is a sound ETag (identical snapshot ⇒ byte-identical body).
 * Quoted per RFC 9110.
 */
function snapshotEtag(provenance: Provenance): string {
  return `"${provenance.snapshot_id}"`
}

/**
 * Does the request's `If-None-Match` hold this `etag`? Handles the list form
 * and the `*` wildcard. Conservative: any parse oddity yields false (serve the
 * full body), never a wrong 304.
 */
function ifNoneMatchSatisfied(
  request: Request | undefined,
  etag: string
): boolean {
  const header = request?.headers.get("If-None-Match")
  if (!header) {
    return false
  }
  if (header.trim() === "*") {
    return true
  }
  return (
    header
      .split(",")
      .map((tag) => tag.trim())
      // Compare ignoring a weak prefix; our validator is strong.
      .map((tag) => (tag.startsWith("W/") ? tag.slice(2) : tag))
      .includes(etag)
  )
}

/**
 * Serialize `body` as a 200 carrying the snapshot `ETag`, or a bodyless 304
 * when the client's `If-None-Match` already matches. Cache-Control rides along
 * on the 304 too so the validator's freshness lifetime is refreshed.
 */
function conditionalResponse(
  body: unknown,
  provenance: Provenance,
  request?: Request,
  cacheControl = CACHE_OK
): Response {
  const etag = snapshotEtag(provenance)
  if (ifNoneMatchSatisfied(request, etag)) {
    return new Response(null, {
      status: 304,
      headers: { ...baseHeaders(cacheControl), ETag: etag },
    })
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...baseHeaders(cacheControl), ETag: etag },
  })
}

/** Wrap a read model in the {data, provenance} envelope, conditional-GET aware. */
function envelopeResponse(
  data: unknown,
  provenance: Provenance,
  request?: Request,
  cacheControl = CACHE_OK
): Response {
  return conditionalResponse(
    { data, provenance },
    provenance,
    request,
    cacheControl
  )
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
 * Reject non-GET with a cheap 405 rather than falling through to the SSR shell
 * — an uncacheable HTML render is a far more expensive flood target than a 405.
 */
export function handleMethodNotAllowed(): Response {
  return new Response(
    JSON.stringify({
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET is supported." },
    }),
    {
      status: 405,
      headers: { ...baseHeaders(CACHE_MISS), Allow: "GET, OPTIONS" },
    }
  )
}

/** GET /api/v1/tokens — the published index (discovery + cross-token queries). */
export async function handleGetTokens(request?: Request): Promise<Response> {
  const [data, provenance] = await Promise.all([getIndex(), getProvenance()])
  return envelopeResponse(data, provenance, request)
}

/** GET /api/v1/framework — canonical metric/criteria definitions + anchors. */
export async function handleGetFramework(request?: Request): Promise<Response> {
  const [data, provenance] = await Promise.all([
    getFramework(),
    getProvenance(),
  ])
  return envelopeResponse(data, provenance, request)
}

/** GET /api/v1/faq — published framework/methodology Q&A. */
export async function handleGetFaq(request?: Request): Promise<Response> {
  const [data, provenance] = await Promise.all([getFaq(), getProvenance()])
  return envelopeResponse(data, provenance, request)
}

/** GET /api/v1/tokens/{id} — one composed token doc (the per-token reusable unit). */
export async function handleGetToken(
  tokenId: string,
  request?: Request
): Promise<Response> {
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
  return envelopeResponse(doc, await getProvenance(), request)
}

/**
 * GET /api/v1/openapi.json — machine-readable contract, built from the vendored
 * Zod read-models (openapi.ts) so it tracks the served shapes automatically.
 */
export async function handleGetOpenApi(request?: Request): Promise<Response> {
  const provenance = await getProvenance()
  return conditionalResponse(buildOpenApiDocument(), provenance, request)
}

/**
 * GET /api/v1 (served as /api/v1/index.json) — discovery root pointing consumers
 * at the formal schema and the human/agent guides.
 */
export async function handleGetDiscovery(request?: Request): Promise<Response> {
  const provenance = await getProvenance()
  const body = {
    name: "Ownership Token Framework API",
    version: "v1",
    endpoints: [
      "/api/v1/tokens",
      "/api/v1/tokens/{id}",
      "/api/v1/framework",
      "/api/v1/faq",
    ],
    schema: "/api/v1/openapi.json",
    guides: ["/llms.txt", "/agent-guide.md"],
    provenance,
  }
  return conditionalResponse(body, provenance, request)
}
