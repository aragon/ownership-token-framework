/**
 * Query definitions for the published read models.
 *
 * Server side (`import.meta.env.SSR` is statically true), queryFns read the
 * published data source directly — no self-HTTP, and Vite's static
 * replacement guarantees the dynamic import (and the data behind it) is
 * dropped from the client build entirely.
 *
 * Client side, queryFns fetch the canonical JSON endpoints — the app is the
 * first consumer of its own published API (/api/v1/tokens*).
 *
 * Published data is immutable per snapshot (~90-day editorial cadence), so
 * staleTime/gcTime are Infinity: a new snapshot arrives as a new deployment
 * (later: a new Edge Config pointer), never as a background refetch.
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
      const { getPublishedIndex } = await import("@/lib/server/published-data")
      return getPublishedIndex()
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
      const { getPublishedFramework } = await import(
        "@/lib/server/published-data"
      )
      return getPublishedFramework()
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
        const { getPublishedTokenDoc } = await import(
          "@/lib/server/published-data"
        )
        return getPublishedTokenDoc(normalizedId)
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
