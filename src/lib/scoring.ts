import { getMetricsByTokenId, type Metric } from "@/lib/metrics-data"

export interface MetricScore {
  metricId: string
  metricName: string
  passing: number
  total: number
  percentage: number
  evaluated: boolean
}

export interface TokenScore {
  tokenId: string
  passing: number
  total: number
  percentage: number
  metrics: MetricScore[]
}

export type ScoreStatus = "passing" | "warning" | "not-evaluated"

const POSITIVE_STATUS = "✅"

/**
 * Metrics excluded from the ownership score calculation.
 * These are metrics Aragon has not yet formally evaluated as part
 * of the ownership framework. Matches Figma design where
 * "Offchain Dependencies" shows "Not evaluated" and is excluded
 * from the aggregate X/Y score.
 *
 * TODO: Replace with an explicit "evaluated" field in metrics.json
 * after syncing with Jordan per APP-406 AC.
 */
const UNEVALUATED_METRIC_IDS = new Set(["offchain"])

export function getScoreStatus(
  percentage: number,
  evaluated: boolean
): ScoreStatus {
  if (!evaluated) return "not-evaluated"
  return percentage >= 75 ? "passing" : "warning"
}

export function getMetricScore(metric: Metric): MetricScore {
  const evaluated = !UNEVALUATED_METRIC_IDS.has(metric.id)
  const total = metric.criteria.length
  const passing = metric.criteria.filter(
    (c) => c.status === POSITIVE_STATUS
  ).length
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return {
    metricId: metric.id,
    metricName: metric.name,
    passing,
    total,
    percentage,
    evaluated,
  }
}

export function getTokenOwnershipScore(tokenId: string): TokenScore {
  const metrics = getMetricsByTokenId(tokenId)
  const metricScores = metrics.map(getMetricScore)

  const evaluatedMetrics = metricScores.filter((m) => m.evaluated)
  const passing = evaluatedMetrics.reduce((sum, m) => sum + m.passing, 0)
  const total = evaluatedMetrics.reduce((sum, m) => sum + m.total, 0)
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return {
    tokenId,
    passing,
    total,
    percentage,
    metrics: metricScores,
  }
}
