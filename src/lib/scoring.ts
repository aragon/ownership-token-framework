import { CRITERIA_STATUS, getMetricsByTokenId, type Metric } from "@/lib/metrics-data"

export interface MetricScore {
  metricId: string
  metricName: string
  passing: number
  total: number
  percentage: number
  evaluated: boolean
  reference: boolean
}

export interface TokenScore {
  tokenId: string
  passing: number
  total: number
  percentage: number
  metrics: MetricScore[]
}

export type ScoreStatus = "passing" | "warning" | "not-evaluated"

export function getScoreStatus(
  percentage: number,
  evaluated: boolean
): ScoreStatus {
  if (!evaluated) return "not-evaluated"
  return percentage >= 75 ? "passing" : "warning"
}

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

export function getTokenOwnershipScore(tokenId: string): TokenScore {
  const metrics = getMetricsByTokenId(tokenId)
  const metricScores = metrics.map(getMetricScore)

  const scoredMetrics = metricScores.filter((m) => m.evaluated && !m.reference)
  const passing = scoredMetrics.reduce((sum, m) => sum + m.passing, 0)
  const total = scoredMetrics.reduce((sum, m) => sum + m.total, 0)
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return {
    tokenId,
    passing,
    total,
    percentage,
    metrics: metricScores,
  }
}
