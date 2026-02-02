import { IconCircleCheckFilled, IconCircleDotFilled } from "@tabler/icons-react"
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
import { cn } from "../lib/utils.ts"
import { EvidenceCard, isFullEvidence } from "./evidence-card.tsx"
import { type CriteriaStatus, mapStatus } from "./token-detail"
import { Badge } from "./ui/badge.tsx"
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
      iconColor: "text-green-500",
    }))
    .otherwise(() => ({
      Icon: IconCircleDotFilled,
      iconColor: "text-gray-500",
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

export default function MetricCard(props: MetricCardProps) {
  const { metric, openCriteria, onOpenCriteriaChange } = props

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

    onOpenCriteriaChange?.(newOpenCriteria)
  }

  return (
    <div className="rounded-lg border bg-card gap-y-4 flex flex-col pb-4">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between gap-3">
          <TitlePopover
            description={metric.about}
            learnMoreLink={getFrameworkUrl(metric.id)}
            title={metric.name}
          />
          <span className="flex gap-1 pr-8">
            {metric.tags?.map((tag) => (
              <Badge
                key={tag}
                variant={metric.id === "gov-fdn" ? "outline" : "secondary"}
              >
                {tag}
              </Badge>
            ))}
          </span>
        </div>
        <p className={cn(summaryTextStyles, "pt-1.5 pr-8")}>{metric.summary}</p>
      </div>

      {/* Criteria list */}
      <Accordion
        className="w-auto"
        multiple
        onValueChange={handleCriteriaChange}
        value={openCriteria}
      >
        {metric.criteria.map((criteria) => (
          <AccordionItem
            className="mx-6 p-0"
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
                      className={cn(summaryTextStyles, "prose pr-8 max-w-none")}
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
