import { CRITERIA_STATUS, getTokenDoc, type Metric } from "@/lib/metrics-data"
import type { MetricScore, TokenScore } from "@/lib/schemas"

export type { MetricScore, TokenScore }

export type ScoreStatus = "passing" | "warning" | "not-evaluated"

export function getScoreStatus(
  percentage: number,
  evaluated: boolean
): ScoreStatus {
  if (!evaluated) return "not-evaluated"
  return percentage >= 75 ? "passing" : "warning"
}

/**
 * Pure per-metric scoring, used at render time by metric cards. The same
 * logic runs at compose time in scripts/compose-data.mjs (the two are pinned
 * to each other by the golden round-trip tests).
 */
export function getMetricScore(metric: Metric): MetricScore {
  const reference = metric.tags?.includes("Reference") ?? false
  const evaluatedCriteria = metric.criteria.filter(
    (c) =>
      c.status === CRITERIA_STATUS.POSITIVE ||
      c.status === CRITERIA_STATUS.WARNING ||
      c.status === CRITERIA_STATUS.AT_RISK
  )
  const total = evaluatedCriteria.length
  const passing = evaluatedCriteria.filter(
    (c) => c.status === CRITERIA_STATUS.POSITIVE
  ).length
  const evaluated = reference ? false : total > 0
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return {
    metricId: metric.id,
    metricName: metric.name,
    passing,
    total,
    percentage,
    evaluated,
    reference,
  }
}

/** Token scores are precomputed at compose time and read off the token doc. */
export function getTokenOwnershipScore(tokenId: string): TokenScore {
  const doc = getTokenDoc(tokenId)
  if (doc) return doc.score
  return { tokenId, passing: 0, total: 0, percentage: 0, metrics: [] }
}
