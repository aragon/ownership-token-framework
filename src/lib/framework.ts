import frameworkData from "@/data/framework.json"

export interface FrameworkMetric {
  id: string
  name: string
  about: string
  criteria: FrameworkCriteria[]
}

export interface FrameworkCriteria {
  id: string
  name: string
  about: string
}

export const FRAMEWORK_BASE_URL =
  "https://github.com/aragon/ownership-token-index-framework/blob/develop/README.md"

/**
 * Map metric IDs to their corresponding README section anchors
 */
const METRIC_ANCHORS: Record<string, string> = {
  "onchain-ctrl": "#metric-1-onchain-control",
  "val-accrual": "#metric-2-value-accrual",
  "verifiability": "#metric-3-verifiability",
  "distribution": "#metric-4-token-distribution",
  "offchain": "#offchain-dependencies",
}

/**
 * Get framework metric definition by ID
 */
export function getFrameworkMetric(metricId: string): FrameworkMetric | null {
  const metric = frameworkData.find((m) => m.id === metricId)
  return metric || null
}

/**
 * Get framework criteria definition by ID
 */
export function getFrameworkCriteria(
  criteriaId: string
): FrameworkCriteria | null {
  for (const metric of frameworkData) {
    const criteria = metric.criteria.find((c) => c.id === criteriaId)
    if (criteria) return criteria
  }
  return null
}

/**
 * Get all framework metrics
 */
export function getAllFrameworkMetrics(): FrameworkMetric[] {
  return frameworkData
}

/**
 * Get the framework URL for a specific metric, with anchor to its section
 */
export function getFrameworkUrl(metricId: string): string {
  const anchor = METRIC_ANCHORS[metricId]
  return anchor ? `${FRAMEWORK_BASE_URL}${anchor}` : FRAMEWORK_BASE_URL
}
