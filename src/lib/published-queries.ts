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
 * A given snapshot is immutable, but `latest` advances on each publish — so the
 * queries are served from cache for a short TTL and then revalidated in the
 * background (stale-while-revalidate). A long-open tab picks up new publishes
 * without a reload, and a stale entry refreshes silently. Components keep these
 * observed (useSuspenseQuery at the route root), which drives the revalidation
 * AND prevents the entry from being garbage-collected out from under the
 * synchronous readers — the cause of the "not in the query cache" crash.
 */
import {
  type FetchQueryOptions,
  type QueryClient,
  type QueryKey,
  queryOptions,
} from "@tanstack/react-query"
import type { FrameworkDoc, IndexRow, TokenDoc } from "@/lib/schemas"

async function fetchEnvelopeData<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Published data fetch failed: ${res.status} ${url}`)
  }
  const payload = (await res.json()) as { data: T }
  return payload.data
}

// Server-only. In release mode the published data can change within the process
// lifetime (a new GitHub Release), so on the shared QueryClient we force a fresh
// read per SSR (below) rather than serving the TTL-cached snapshot. Statically
// false on the client (import.meta.env.SSR), so client caching is unchanged.
const RELEASE_MODE_SSR =
  import.meta.env.SSR && process.env.OTF_PUBLISHED_RELEASE === "true"

/**
 * Ensure a published query is cached for this render. In release-mode SSR we
 * force a revalidated read so the loader can't serve a process-pinned snapshot;
 * the actual fetch is still deduped + 60s-cached by published-source, so this
 * doesn't hammer GitHub. Committed mode and the client reuse the cached value
 * (data is immutable per deploy there).
 */
export async function readPublished<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
>(
  client: QueryClient,
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): Promise<void> {
  if (RELEASE_MODE_SSR) {
    await client.fetchQuery({ ...options, staleTime: 0 })
    return
  }
  await client.ensureQueryData(options)
}

// Serve published content fresh for a TTL, then revalidate in the background.
// gcTime > staleTime so a briefly-unobserved query (e.g. a token doc after
// navigating away) survives long enough for a quick return.
//
// The TTL only bounds how quickly an *already-open* tab notices a NEW publish.
// Publishes are currently rare (a new content snapshot every several weeks), so
// 30 min comfortably suits the cadence — it could safely be raised to an hour+
// with no practical downside. Revisit (lower it) if the publish cadence ever
// becomes frequent and editors need near-real-time pickup without a reload.
const PUBLISHED_STALE_TIME = 30 * 60 * 1000 // 30 min
const PUBLISHED_GC_TIME = 60 * 60 * 1000 // 1 h

export const publishedIndexQuery = queryOptions({
  queryKey: ["published", "index"],
  queryFn: async (): Promise<{ tokens: IndexRow[] }> => {
    if (import.meta.env.SSR) {
      const { getIndex } = await import("@/lib/server/published-source")
      return getIndex()
    }
    return fetchEnvelopeData("/api/v1/tokens")
  },
  staleTime: PUBLISHED_STALE_TIME,
  gcTime: PUBLISHED_GC_TIME,
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
  staleTime: PUBLISHED_STALE_TIME,
  gcTime: PUBLISHED_GC_TIME,
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
    staleTime: PUBLISHED_STALE_TIME,
    gcTime: PUBLISHED_GC_TIME,
  })
}
