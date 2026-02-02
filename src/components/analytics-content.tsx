import type { Metric } from "@/lib/metrics-data"
import MetricCard from "./metric-card"

interface AnalyticsContentProps {
  metrics: Metric[]
  openCriteria?: string[]
  onOpenCriteriaChange?: (value: string[]) => void
}

export default function AnalyticsContent(props: AnalyticsContentProps) {
  const { metrics, openCriteria, onOpenCriteriaChange } = props
  // const [filterValue, setFilterValue] = useState("")
  // const [viewBy, setViewBy] = useState("metric")

  return (
    <div className="space-y-4">
      {/* Filter bar
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FilterIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Filter by criteria or metric ..."
            value={filterValue}
          />
        </div>
        <Select
          onValueChange={(value) => value && setViewBy(value)}
          value={viewBy}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">metric</SelectItem>
            <SelectItem value="criteria">criteria</SelectItem>
            <SelectItem value="status">status</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Metrics */}
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
