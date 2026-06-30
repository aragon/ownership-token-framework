/**
 * Query definitions for the published read models.
 *
 * On the server (`import.meta.env.SSR`) queryFns read published-source directly
 * — the SAME seam the API uses, so SSR/UI and /api/v1 never disagree. Vite's
 * static replacement drops the dynamic import from the client build entirely.
 * On the client they fetch the canonical JSON endpoints (the app is the first
 * consumer of its own API).
 *
 * Snapshots are immutable but `latest` advances on each publish, so queries are
 * stale-while-revalidate: a long-open tab picks up new publishes without a
 * reload. Components keep these observed (useSuspenseQuery at the route root),
 * which drives revalidation AND prevents GC of entries the synchronous readers
 * depend on — the cause of the "not in the query cache" crash.
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

// Server-only. In release mode published data can change within the process
// lifetime (a new Release), so on the shared QueryClient we force a fresh read
// per SSR rather than serving the TTL-cached snapshot. Statically false on the
// client, so client caching is unchanged.
const RELEASE_MODE_SSR =
  import.meta.env.SSR && process.env.OTF_PUBLISHED_RELEASE === "true"

/**
 * Ensure a published query is cached for this render. In release-mode SSR force
 * a revalidated read so the loader can't serve a process-pinned snapshot (the
 * fetch is still deduped + 60s-cached by published-source). Committed mode and
 * the client reuse the cached value (immutable per deploy there).
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

// gcTime > staleTime so a briefly-unobserved query (e.g. a token doc after
// navigating away) survives long enough for a quick return. The TTL only bounds
// how fast an already-open tab notices a NEW publish; publishes are rare (every
// several weeks) so 30 min is ample. Lower it if the cadence ever gets frequent.
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
