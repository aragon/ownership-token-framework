import { publishedFrameworkQuery } from "@/lib/published-queries"
import { queryClient } from "@/lib/query-client"
import type { FrameworkDoc } from "@/lib/schemas"

export type FrameworkMetric = FrameworkDoc["metrics"][number]
export type FrameworkCriteria = FrameworkMetric["criteria"][number]

/**
 * Synchronous read over the hydrated query cache; the root route loader
 * ensures the framework doc on every page. Fails loudly on a cache miss.
 */
function readFramework(): FrameworkDoc {
  const data = queryClient.getQueryData(publishedFrameworkQuery.queryKey)
  if (!data) {
    throw new Error(
      "Published framework doc is not in the query cache — a route loader must ensure publishedFrameworkQuery before render"
    )
  }
  return data
}

/**
 * Base URL of the framework README. Data-owned (content/framework/_meta.json),
 * so it is a render-time read, not a module constant.
 */
export function getFrameworkBaseUrl(): string {
  return readFramework().baseUrl
}

/**
 * Get framework metric definition by ID
 */
export function getFrameworkMetric(metricId: string): FrameworkMetric | null {
  const metric = readFramework().metrics.find((m) => m.id === metricId)
  return metric || null
}

/**
 * Get framework criteria definition by ID
 */
export function getFrameworkCriteria(
  criteriaId: string
): FrameworkCriteria | null {
  for (const metric of readFramework().metrics) {
    const criteria = metric.criteria.find((c) => c.id === criteriaId)
    if (criteria) return criteria
  }
  return null
}

/**
 * Get all framework metrics
 */
export function getAllFrameworkMetrics(): FrameworkMetric[] {
  return readFramework().metrics
}

/**
 * Get the framework URL for a specific metric, with anchor to its section
 */
export function getFrameworkUrl(metricId: string): string {
  const anchor = getFrameworkMetric(metricId)?.anchor
  const baseUrl = getFrameworkBaseUrl()
  return anchor ? `${baseUrl}${anchor}` : baseUrl
}
