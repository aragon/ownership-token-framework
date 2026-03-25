import {
  IconCircleCheckFilled,
  IconCircleX,
  // @ts-expect-error by default it imports from cjs build and triggers server-side error
} from "@tabler/icons-react/dist/esm/tabler-icons-react.mjs"
import ReactMarkdown from "react-markdown"
import { match, P } from "ts-pattern"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { trackCriterionOpen } from "@/lib/analytics"
import { getFrameworkUrl } from "@/lib/framework"
import type { Evidence, Metric } from "@/lib/metrics-data"
import { getMetricScore, getScoreStatus } from "@/lib/scoring"
import { cn } from "../lib/utils.ts"
import { EvidenceCard, isFullEvidence } from "./evidence-card.tsx"
import { type CriteriaStatus, mapStatus } from "./token-detail"
import { BadgeEvaluation } from "./ui/badge-evaluation.tsx"
import { TitlePopover } from "./ui/title-popover.tsx"

interface MarkdownComponentProps {
  children?: React.ReactNode
  href?: string
}

const markdownComponents = {
  p: ({ children }: MarkdownComponentProps) => <p>{children}</p>,
  a: ({ href, children }: MarkdownComponentProps) => (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ),
}

const StatusIcon = ({ status }: { status: CriteriaStatus }) => {
  const config = match(status)
    .with("positive", () => ({
      Icon: IconCircleCheckFilled,
      iconColor: "text-gray-600",
    }))
    .otherwise(() => ({
      Icon: IconCircleX,
      iconColor: "text-gray-600",
    }))

  return <config.Icon className={`size-6 ${config.iconColor}`} />
}

const summaryTextStyles =
  "text-base leading-6 tracking-normal text-muted-foreground"

interface MetricCardProps {
  metric: Metric
  openCriteria?: string[]
  onOpenCriteriaChange?: (value: string[]) => void
}

const scoreColorMap = {
  passing: {
    border: "border-green-300",
    headerBg: "bg-green-50",
    titleColor: "text-green-900",
    summaryColor: "text-green-700",
  },
  warning: {
    border: "border-yellow-300",
    headerBg: "bg-yellow-50",
    titleColor: "text-yellow-900",
    summaryColor: "text-yellow-700",
  },
  "not-evaluated": {
    border: "border-gray-200",
    headerBg: "bg-gray-50",
    titleColor: "text-gray-900",
    summaryColor: "text-gray-700",
  },
}

export default function MetricCard(props: MetricCardProps) {
  const { metric, openCriteria, onOpenCriteriaChange } = props

  const score = getMetricScore(metric)
  const status = getScoreStatus(score.percentage, score.evaluated)
  const colors = scoreColorMap[status]

  const metricCriteriaIds = new Set(metric.criteria.map((c) => c.id))

  const handleCriteriaChange = (newOpenCriteria: string[]) => {
    // Track newly opened criteria
    const previouslyOpen = new Set(openCriteria || [])
    const newlyOpened = newOpenCriteria.filter((id) => !previouslyOpen.has(id))

    newlyOpened.forEach((criterionId) => {
      const criterion = metric.criteria.find((c) => c.id === criterionId)
      if (criterion) {
        trackCriterionOpen(criterion.id, criterion.name)
      }
    })

    // Merge: keep other metrics' criteria, replace only this metric's criteria
    const otherCriteria = (openCriteria || []).filter(
      (id) => !metricCriteriaIds.has(id)
    )
    onOpenCriteriaChange?.([...otherCriteria, ...newOpenCriteria])
  }

  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm bg-card flex flex-col pb-0 md:pb-2 overflow-hidden",
        colors.border
      )}
    >
      {/* Header */}
      <div className={cn("p-4 md:px-6 md:py-6", colors.headerBg)}>
        <div className="flex items-center justify-between gap-3">
          <TitlePopover
            description={metric.about}
            learnMoreLink={getFrameworkUrl(metric.id)}
            title={metric.name}
            titleClassName={colors.titleColor}
          />
          <BadgeEvaluation
            className="shrink-0"
            evaluated={score.evaluated}
            passing={score.passing}
            total={score.total}
          />
        </div>
        <p
          className={cn(
            "text-base leading-6 tracking-normal pt-3",
            colors.summaryColor
          )}
        >
          {metric.summary}
        </p>
      </div>

      {/* Criteria list */}
      <Accordion
        className="w-auto"
        multiple
        onValueChange={handleCriteriaChange}
        value={openCriteria?.filter((id) => metricCriteriaIds.has(id))}
      >
        {metric.criteria.map((criteria, index) => (
          <AccordionItem
            className={cn("mx-4 p-0 md:mx-6", index === 0 && "first:border-t-0")}
            key={criteria.id}
            value={criteria.id}
          >
            <AccordionTrigger className="py-4 hover:no-underline gap-x-4 items-center">
              <div className="w-full">
                <TitlePopover
                  description={criteria.about}
                  title={criteria.name}
                  variant="h4"
                />
              </div>
              <StatusIcon status={mapStatus(criteria.status)} />
            </AccordionTrigger>
            <AccordionContent className="p-0 pb-4">
              <div className="flex flex-col gap-4">
                {match(criteria.notes)
                  .with(P.string, (notes) => (
                    // <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                    <div
                      className={cn(
                        summaryTextStyles,
                        "prose pr-0 max-w-none md:pr-8"
                      )}
                    >
                      <ReactMarkdown components={markdownComponents}>
                        {notes}
                      </ReactMarkdown>
                    </div>
                  ))
                  .otherwise(() => null)}
                {match(criteria.evidence)
                  .with(P.union(P.nullish, []), () => null)
                  .otherwise((evidenceList) => (
                    <div className="flex flex-col gap-4">
                      {evidenceList.map((evidence, index) => {
                        // Convert legacy format to full evidence format
                        const fullEvidence: Evidence = isFullEvidence(evidence)
                          ? evidence
                          : { urls: [evidence] }

                        return (
                          <EvidenceCard
                            evidence={fullEvidence}
                            key={`${criteria.id}-ev-${index}`}
                          />
                        )
                      })}
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
