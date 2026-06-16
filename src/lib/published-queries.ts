/**
 * Query definitions for the published read models.
 *
 * Server side (`import.meta.env.SSR` is statically true), queryFns read the
 * published source directly — the SAME seam the API uses (published-source),
 * so SSR/UI and /api/v1 never disagree: both serve committed data by default
 * and both serve the release snapshot when release mode is on. No self-HTTP,
 * and Vite's static replacement drops the dynamic import (and the data behind
 * it) from the client build entirely.
 *
 * Client side, queryFns fetch the canonical JSON endpoints — the app is the
 * first consumer of its own published API (/api/v1/tokens*).
 *
 * Published data is immutable per snapshot, so staleTime/gcTime are Infinity:
 * a new snapshot arrives as a new deployment, or — in release mode — as the
 * next SSR render reading a newer release, never as a background refetch.
 */
import { queryOptions } from "@tanstack/react-query"
import type { FrameworkDoc, IndexRow, TokenDoc } from "@/lib/schemas"

async function fetchEnvelopeData<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Published data fetch failed: ${res.status} ${url}`)
  }
  const payload = (await res.json()) as { data: T }
  return payload.data
}

export const publishedIndexQuery = queryOptions({
  queryKey: ["published", "index"],
  queryFn: async (): Promise<{ tokens: IndexRow[] }> => {
    if (import.meta.env.SSR) {
      const { getIndex } = await import("@/lib/server/published-source")
      return getIndex()
    }
    return fetchEnvelopeData("/api/v1/tokens")
  },
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})

export const publishedFrameworkQuery = queryOptions({
  queryKey: ["published", "framework"],
  queryFn: async (): Promise<FrameworkDoc> => {
    if (import.meta.env.SSR) {
      const { getFramework } = await import("@/lib/server/published-source")
      return getFramework()
    }
    return fetchEnvelopeData("/api/v1/framework")
  },
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})

export const publishedTokenDocQuery = (tokenId: string) => {
  const normalizedId = tokenId.trim().toLowerCase()
  return queryOptions({
    queryKey: ["published", "token-doc", normalizedId],
    queryFn: async (): Promise<TokenDoc | null> => {
      if (import.meta.env.SSR) {
        const { getTokenDoc } = await import("@/lib/server/published-source")
        return getTokenDoc(normalizedId)
      }
      const res = await fetch(`/api/v1/tokens/${normalizedId}`)
      if (res.status === 404) return null
      if (!res.ok) {
        throw new Error(`Published data fetch failed: ${res.status}`)
      }
      const payload = (await res.json()) as { data: TokenDoc }
      return payload.data
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
}
