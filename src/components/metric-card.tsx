import { IconCircleCheckFilled, IconCircleDotFilled } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { match, P } from "ts-pattern"
import checklistData from "@/data/checklist.json"
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
import type { Metric } from "./token-detail"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

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

const markdownComponentsInline = {
  p: ({ children }: MarkdownComponentProps) => <p>{children}</p>,
  a: ({ href, children }: MarkdownComponentProps) => (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ),
}

// Helper to find matching checklist data
const getChecklistMetric = (metricId: string) => {
  return checklistData.find(item => item.id === metricId)
}

const getChecklistCriteria = (metricId: string, criteriaName: string) => {
  const metric = getChecklistMetric(metricId)
  return metric?.criteria.find(c => c.name.toLowerCase().includes(criteriaName.toLowerCase()))
}

const StatusHoverCard = ({ status }: { status: string }) => {
  const config = match(status)
    .with("positive", () => ({
      label: "Verified",
      colorClass: "text-green-800",
      Icon: IconCircleCheckFilled,
      iconColor: "text-green-500",
    }))
    .otherwise(() => ({
      label: "Unverified",
      colorClass: "text-gray-800",
      Icon: IconCircleDotFilled,
      iconColor: "text-gray-500",
    }))

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Button
            className={`font-normal ${config.colorClass}`}
            nativeButton={false}
            render={<div />}
            variant="outline"
          />
        }
      >
        {config.label}
        <config.Icon className={`size-5 ${config.iconColor}`} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="flex gap-x-1">
          <h3 className={config.colorClass}>{config.label}</h3>
          <config.Icon className={`size-5 ${config.iconColor}`} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {match(status)
            .with(
              "positive",
              () =>
                "Verified indicates that the development team has conducted comprehensive research on the criteria and substantiated their findings with solid evidence. This process ensures that the information is reliable and meets established standards, providing confidence in its validity."
            )
            .otherwise(
              () =>
                "Unverified indicates that the development team has not yet conducted comprehensive research on the criteria. Further investigation is needed to substantiate the findings and ensure the information meets established standards."
            )}
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

export default function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-lg border bg-card gap-y-4 flex flex-col">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{metric.name}</h3>
          {match(getChecklistMetric(metric.id))
            .with(P.not(P.nullish), (checklistMetric) => (
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <Button
                      className="text-sm text-chart-4 underline decoration-dotted hover:text-chart-4/80 transition-colors font-normal"
                      nativeButton={false}
                      render={<div />}
                      variant="ghost"
                    />
                  }
                >
                  About this metric
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{checklistMetric.name}</h4>
                    <p className="text-sm text-muted-foreground">{checklistMetric.about}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))
            .otherwise(() => 
              match(metric.aboutLink)
                .with(P.string, (link) => (
                  <a
                    className="text-sm text-chart-4 underline decoration-dotted"
                    href={link}
                  >
                    About this metric
                  </a>
                ))
                .otherwise(() => null)
            )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {metric.description}
        </p>
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
              <StatusHoverCard status={criteria.status} />
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-4">
                {match(criteria.description)
                  .with(P.string, (description) => (
                    <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                      <ReactMarkdown components={markdownComponents}>
                        {description}
                      </ReactMarkdown>
                    </div>
                  ))
                  .otherwise(() => null)}
                {match(criteria.body)
                  .with(P.string, (body) => (
                    <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                      <ReactMarkdown components={markdownComponents}>
                        {body}
                      </ReactMarkdown>
                    </div>
                  ))
                  .otherwise(() => null)}
                {match(criteria.evidences)
                  .with(P.union(P.nullish, []), () => null)
                  .otherwise((evidences) => (
                    <ItemGroup className="gap-y-4">
                      {evidences.map((evidence) => (
                        <Item key={evidence.id} variant="muted">
                          <ItemContent>
                            <ItemTitle>{evidence.title}</ItemTitle>
                            {match(evidence.comment)
                              .with(P.string, (comment) => (
                                <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                                  <ReactMarkdown
                                    components={markdownComponentsInline}
                                  >
                                    {comment}
                                  </ReactMarkdown>
                                </div>
                              ))
                              .otherwise(() => null)}
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
                {match(getChecklistCriteria(metric.id, criteria.name))
                  .with(P.not(P.nullish), (checklistCriteria) => (
                    <HoverCard>
                      <HoverCardTrigger
                        render={
                          <Button
                            className="inline-block text-sm text-chart-4 underline decoration-dotted hover:text-chart-4/80 transition-colors font-normal"
                            nativeButton={false}
                            render={<div />}
                            variant="ghost"
                          />
                        }
                      >
                        About this criteria
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{checklistCriteria.name}</h4>
                          <p className="text-sm text-muted-foreground">{checklistCriteria.about}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))
                  .otherwise(() => (
                    <button
                      className="inline-block text-sm text-chart-4 underline decoration-dotted"
                      onClick={() => console.log("About criteria clicked")}
                      type="button"
                    >
                      About this criteria
                    </button>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
