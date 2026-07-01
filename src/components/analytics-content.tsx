import type { Metric } from "@/lib/metrics-data"
import MetricCard from "./metric-card"

interface AnalyticsContentProps {
  metrics: Metric[]
  openCriteria?: string[]
  onOpenCriteriaChange?: (value: string[]) => void
}

export default function AnalyticsContent(props: AnalyticsContentProps) {
  const { metrics, openCriteria, onOpenCriteriaChange } = props

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onOpenCriteriaChange={onOpenCriteriaChange}
            openCriteria={openCriteria}
          />
        ))}
      </div>
    </div>
  )
}
