import { publishedTokenDocQuery } from "@/lib/published-queries"
import { queryClient } from "@/lib/query-client"
import {
  type ComposedCriterion,
  type ComposedMetric,
  CRITERIA_STATUS,
  type CriteriaStatusValue,
  type Evidence,
  type EvidenceUrl,
  type TokenDoc,
} from "@/lib/schemas"
import { getTokenById } from "@/lib/token-data"

export { CRITERIA_STATUS }
export type { CriteriaStatusValue, Evidence, EvidenceUrl }
export type Criteria = ComposedCriterion
export type Metric = ComposedMetric

/**
 * Synchronous read over the hydrated query cache. The token detail route
 * loader ensures the doc; an unensured read fails loudly by design.
 * A cached `null` means the token does not exist (valid, returns null).
 */
export function getTokenDoc(tokenId: string): TokenDoc | null {
  const { queryKey } = publishedTokenDocQuery(tokenId)
  const doc = queryClient.getQueryData(queryKey)
  if (doc === undefined) {
    throw new Error(
      `Token doc "${tokenId}" is not in the query cache — the route loader must ensure publishedTokenDocQuery`
    )
  }
  return doc
}

/**
 * Cross-token criterion status, served from the index read model (the
 * dashboard renders single-criterion columns across all tokens without
 * loading per-token docs). Statuses are schema-validated canonical values
 * (ADR 0002) — no runtime normalization layer exists by design.
 */
export function getCriteriaStatus(
  tokenId: string,
  criteriaId: string
): CriteriaStatusValue {
  const row = getTokenById(tokenId)
  return row?.criteriaStatuses[criteriaId] ?? CRITERIA_STATUS.REFERENCE
}

export function getMetricsByTokenId(tokenId: string): Metric[] {
  return getTokenDoc(tokenId)?.metrics ?? []
}
