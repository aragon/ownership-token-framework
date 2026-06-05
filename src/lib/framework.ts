import frameworkData from "@/data/generated/framework.json"
import type { FrameworkDoc } from "@/lib/schemas"

const framework = frameworkData as FrameworkDoc

export type FrameworkMetric = FrameworkDoc["metrics"][number]
export type FrameworkCriteria = FrameworkMetric["criteria"][number]

export const FRAMEWORK_BASE_URL = framework.baseUrl

/**
 * Get framework metric definition by ID
 */
export function getFrameworkMetric(metricId: string): FrameworkMetric | null {
  const metric = framework.metrics.find((m) => m.id === metricId)
  return metric || null
}

/**
 * Get framework criteria definition by ID
 */
export function getFrameworkCriteria(
  criteriaId: string
): FrameworkCriteria | null {
  for (const metric of framework.metrics) {
    const criteria = metric.criteria.find((c) => c.id === criteriaId)
    if (criteria) return criteria
  }
  return null
}

/**
 * Get all framework metrics
 */
export function getAllFrameworkMetrics(): FrameworkMetric[] {
  return framework.metrics
}

/**
 * Get the framework URL for a specific metric, with anchor to its section
 */
export function getFrameworkUrl(metricId: string): string {
  const anchor = getFrameworkMetric(metricId)?.anchor
  return anchor ? `${FRAMEWORK_BASE_URL}${anchor}` : FRAMEWORK_BASE_URL
}
