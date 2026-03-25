import { CircleHelpIcon } from "lucide-react"
import { BadgeEvaluation } from "@/components/ui/badge-evaluation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getTokenOwnershipScore } from "@/lib/scoring"

interface OwnershipScoreCardProps {
  tokenId: string
}

export function OwnershipScoreCard({ tokenId }: OwnershipScoreCardProps) {
  const score = getTokenOwnershipScore(tokenId)

  return (
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <Tooltip>
          <TooltipTrigger className="inline-flex items-center gap-2 text-lg font-bold leading-7 cursor-help">
            Ownership score
            <CircleHelpIcon className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            Percentage of passing ownership criteria evaluated across all
            metrics in the framework.
          </TooltipContent>
        </Tooltip>
        <BadgeEvaluation passing={score.passing} total={score.total} />
      </div>

      <div className="mt-4 flex flex-col divide-y border-t">
        {score.metrics.map((m) => (
          <div
            className="flex items-center justify-between py-3"
            key={m.metricId}
          >
            <span className="text-base text-foreground">{m.metricName}</span>
            <BadgeEvaluation
              evaluated={m.evaluated}
              passing={m.passing}
              total={m.total}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
