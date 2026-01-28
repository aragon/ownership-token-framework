import metricsData from "@/data/metrics.json"
import { getFrameworkCriteria, getFrameworkMetric } from "@/lib/framework"
import type { EvidenceLinkType } from "../components/ui/evidence-link.tsx"

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

interface Criteria {
  id: string
  name: string
  about: string
  status: string
  notes: string
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
