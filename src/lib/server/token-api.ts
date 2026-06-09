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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      // Canonical published data: cacheable, must revalidate on new deploys.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
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
      404
    )
  }
  return jsonResponse({ data: doc, provenance: getProvenance() })
}
