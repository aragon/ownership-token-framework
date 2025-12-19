import {
  IconBubble,
  IconCircleArrowDownFilled,
  IconCircleArrowUpFilled,
  IconCircleDotFilled,
} from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import { match } from "ts-pattern"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
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
    <div className="rounded-lg border bg-card">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{metric.name}</h3>
          {metric.aboutLink && (
            <a
              className="text-sm text-blue-600 hover:underline"
              href={metric.aboutLink}
            >
              About this metric
            </a>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {metric.description}
        </p>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <Badge className="rounded-sm" variant="outline">
            <span className="font-medium">{metric.evidenceEntries}</span>
            <span className="text-muted-foreground">evidence entries</span>
            <IconBubble className="size-4 text-muted-foreground" />
          </Badge>
          <Badge
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 rounded-sm"
            variant="outline"
          >
            <span className="font-medium">{metric.positive}</span> Positive
            <IconCircleArrowUpFilled className="text-green-500" />
          </Badge>
          {match(metric)
            .when(
              (m) => m.neutral > 0,
              (m) => (
                <Badge
                  className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 rounded-sm"
                  variant="outline"
                >
                  <span className="font-medium">{m.neutral}</span> Neutral
                  <IconCircleDotFilled className="text-gray-500" />
                </Badge>
              )
            )
            .otherwise(() => null)}
          {match(metric)
            .when(
              (m) => m.atRisk > 0,
              (m) => (
                <Badge
                  className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 rounded-sm"
                  variant="outline"
                >
                  <span className="font-medium">{m.atRisk}</span> At risk
                  <IconCircleArrowDownFilled className="text-red-500" />
                </Badge>
              )
            )
            .otherwise(() => null)}
        </div>
      </div>

      {/* Criteria list */}
      <Accordion className="border-t" multiple>
        {metric.criteria.map((criteria) => (
          <AccordionItem key={criteria.id} value={criteria.id}>
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">{criteria.name}</span>
                {match(criteria)
                  .with({ status: "positive" }, () => (
                    <Badge
                      className="rounded-sm mr-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                      variant="outline"
                    >
                      Positive
                      <IconCircleArrowUpFilled className="text-green-500" />
                    </Badge>
                  ))
                  .with({ status: "neutral" }, () => (
                    <Badge
                      className="rounded-sm mr-2 bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                      variant="outline"
                    >
                      Neutral
                      <IconCircleDotFilled className="text-gray-500" />
                    </Badge>
                  ))
                  .with({ status: "at_risk" }, () => (
                    <Badge
                      className="rounded-sm mr-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      variant="outline"
                    >
                      At risk
                      <IconCircleArrowDownFilled className="text-red-500" />
                    </Badge>
                  ))
                  .exhaustive()}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {criteria.description && (
                <p className="mb-3 text-sm text-muted-foreground">
                  {criteria.description}
                </p>
              )}
              {criteria.evidences && criteria.evidences.length > 0 && (
                <ItemGroup className="gap-y-4">
                  {criteria.evidences.map((evidence) => (
                    <Item key={evidence.id} variant="muted">
                      <ItemContent className="truncate">
                        <ItemTitle>
                          {evidence.title}{" "}
                          <span className="text-muted-foreground">
                            {evidence.url.replace("https://", "")}
                          </span>
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
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
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
