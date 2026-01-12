import { useMemo } from "react"
import { getMetricsByTokenId, type Metric } from "@/lib/metrics-data"

export function useMetrics(tokenId: string): Metric[] {
  return useMemo(() => getMetricsByTokenId(tokenId), [tokenId])
}
