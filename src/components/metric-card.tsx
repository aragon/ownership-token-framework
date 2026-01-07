import { IconCircleCheckFilled, IconCircleDotFilled } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { match } from "ts-pattern"
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
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import type { Metric } from "./token-detail"

export default function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-lg border bg-card gap-y-4 flex flex-col">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{metric.name}</h3>
          {metric.aboutLink && (
            <a
              className="text-sm text-chart-4 underline decoration-dotted"
              href={metric.aboutLink}
            >
              About this metric
            </a>
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
              {match(criteria.status)
                .with("positive", () => (
                  <IconCircleCheckFilled className="size-5 text-green-500" />
                ))
                .otherwise(() => (
                  <IconCircleDotFilled className="size-5 text-gray-500" />
                ))}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {criteria.description && (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-3 text-sm text-muted-foreground">
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => (
                      <a
                        className="text-chart-4 underline decoration-dotted"
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {criteria.description}
                </ReactMarkdown>
              )}
              {criteria.evidences && criteria.evidences.length > 0 && (
                <ItemGroup className="gap-y-4">
                  {criteria.evidences.map((evidence) => (
                    <Item key={evidence.id} variant="muted">
                      <ItemContent className="truncate">
                        <ItemTitle>
                          {evidence.title}{" "}
                          <p className="text-muted-foreground truncate">
                            {evidence.url.replace("https://", "")}
                          </p>
                        </ItemTitle>
                        {evidence.comment && (
                          <ItemDescription className="mt-1">
                            {evidence.comment}
                          </ItemDescription>
                        )}
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
              )}
              <button
                className="mt-3 inline-block text-sm text-chart-4 underline decoration-dotted"
                onClick={() => console.log("About criteria clicked")}
                type="button"
              >
                About this criteria
              </button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
