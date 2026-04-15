import metricsData from "@/data/metrics.json"
import { getFrameworkCriteria, getFrameworkMetric } from "@/lib/framework"
import type { EvidenceLinkType } from "../components/ui/evidence-link.tsx"

export const CRITERIA_STATUS = {
  POSITIVE: "positive",
  WARNING: "warning",
  AT_RISK: "at_risk",
  UNEVALUATED: "unevaluated",
  REFERENCE: "reference",
} as const

export type CriteriaStatusValue =
  (typeof CRITERIA_STATUS)[keyof typeof CRITERIA_STATUS]

export function normalizeCriteriaStatus(
  status?: string
): CriteriaStatusValue {
  if (
    status === CRITERIA_STATUS.POSITIVE ||
    status === CRITERIA_STATUS.WARNING ||
    status === CRITERIA_STATUS.AT_RISK ||
    status === CRITERIA_STATUS.UNEVALUATED ||
    status === CRITERIA_STATUS.REFERENCE
  ) {
    return status
  }
  return CRITERIA_STATUS.REFERENCE
}

export interface EvidenceUrl {
  name: string
  url: string
  type?: EvidenceLinkType
}

export interface Evidence {
  name?: string
  summary?: string
  urls: EvidenceUrl[]
}

export interface Criteria {
  id: string
  name: string
  about: string
  status: string
  notes: string
  tags?: string[]
  evidence: EvidenceUrl[] | Evidence[]
}

export interface Metric {
  id: string
  name: string
  about: string
  summary: string
  tags?: string[]
  criteria: Criteria[]
}

export function getCriteriaStatus(
  tokenId: string,
  criteriaId: string
): CriteriaStatusValue {
  const metrics = metricsData[tokenId as keyof typeof metricsData]
  if (!metrics) return CRITERIA_STATUS.REFERENCE
  for (const m of metrics as Metric[]) {
    for (const c of m.criteria) {
      if (c.id === criteriaId) return normalizeCriteriaStatus(c.status)
    }
  }
  return CRITERIA_STATUS.REFERENCE
}

export function getMetricsByTokenId(tokenId: string): Metric[] {
  const metrics = metricsData[tokenId as keyof typeof metricsData]
  if (!metrics) return []

  return (metrics as Metric[]).map((metric) => {
    const frameworkMetric = getFrameworkMetric(metric.id)

    return {
      ...metric,
      about: frameworkMetric?.about || metric.about,
      criteria: metric.criteria.map((criteria) => {
        const frameworkCriteria = getFrameworkCriteria(criteria.id)

        return {
          ...criteria,
          about: frameworkCriteria?.about || criteria.about,
        }
      }),
    }
  })
}
