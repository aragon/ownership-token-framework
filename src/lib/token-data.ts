import { publishedIndexQuery } from "@/lib/published-queries"
import { queryClient } from "@/lib/query-client"
import type { IndexRow } from "@/lib/schemas"

export type Token = IndexRow

/**
 * Synchronous read over the hydrated query cache. Route loaders are
 * responsible for ensuring the published index before render (the root
 * route loader does this for every page). A cache miss is a programming
 * error and fails loudly by design — no silent fallbacks (ADR 0002 spirit).
 */
function readPublishedIndex(): { tokens: Token[] } {
  const data = queryClient.getQueryData(publishedIndexQuery.queryKey)
  if (!data) {
    throw new Error(
      "Published token index is not in the query cache — a route loader must ensure publishedIndexQuery before render"
    )
  }
  return data
}

function getTokens(): Token[] {
  return readPublishedIndex().tokens
}

function getTokenById(tokenId: string): Token | null {
  const normalizedId = tokenId.trim().toLowerCase()
  return (
    getTokens().find((token) => token.id.toLowerCase() === normalizedId) ?? null
  )
}

export { getTokenById, getTokens }
