import { IconCircleCheckFilled, IconCircleDotFilled } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { match, P } from "ts-pattern"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { getFrameworkUrl } from "@/lib/framework"
import type { Metric } from "@/lib/metrics-data"
import { type CriteriaStatus, mapStatus } from "./token-detail"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
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

  return <config.Icon className={`size-5 ${config.iconColor}`} />
}

export default function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-lg border bg-card gap-y-4 flex flex-col">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <TitlePopover
            description={metric.about}
            learnMoreLink={getFrameworkUrl(metric.id)}
            title={metric.name}
          />
          <h3 className="font-semibold">{metric.name}</h3>
          <HoverCard>
            <HoverCardTrigger
              render={
                <div className="inline-block text-sm text-chart-4 underline decoration-dotted hover:text-chart-4/80 transition-colors font-normal cursor-help" />
              }
            >
              About this metric
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-80 p-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">{metric.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {metric.about}
                  </p>
                </div>
                <a
                  className="inline-flex items-center gap-1 text-sm text-chart-4 hover:text-chart-4/80 transition-colors"
                  href={getFrameworkUrl(metric.id)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Learn more about this metric →
                </a>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      {/* Criteria list */}
      <Accordion className="border rounded-md w-auto m-6 mt-0" multiple>
        {metric.criteria.map((criteria) => (
          <AccordionItem
            className="mx-6 p-0"
            key={criteria.id}
            value={criteria.id}
          >
            <AccordionTrigger className="py-3 hover:no-underline gap-x-1 items-center">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">{criteria.name}</span>
              </div>
              <StatusIcon status={mapStatus(criteria.status)} />
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-4">
                {match(criteria.notes)
                  .with(P.string, (notes) => (
                    <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                      <ReactMarkdown components={markdownComponents}>
                        {notes}
                      </ReactMarkdown>
                    </div>
                  ))
                  .otherwise(() => null)}
                {match(criteria.evidence)
                  .with(P.union(P.nullish, []), () => null)
                  .otherwise((evidenceList) => (
                    <ItemGroup className="gap-y-4">
                      {evidenceList.map((evidence, index) => (
                        <Item
                          key={`${criteria.id}-ev-${index}`}
                          variant="muted"
                        >
                          <ItemContent>
                            <ItemTitle>{evidence.name}</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <Button
                              render={
                                <a
                                  className="no-underline!"
                                  href={evidence.url}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <ArrowUpRightIcon className="size-3.5" />
                                  Open
                                </a>
                              }
                              size="sm"
                              variant="outline"
                            />
                          </ItemActions>
                        </Item>
                      ))}
                    </ItemGroup>
                  ))}
                <HoverCard>
                  <HoverCardTrigger
                    render={
                      <div className="inline-block text-sm text-chart-4 underline decoration-dotted hover:text-chart-4/80 transition-colors font-normal" />
                    }
                  >
                    About this criteria
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-80 p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{criteria.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {criteria.about}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
