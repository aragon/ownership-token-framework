import { Link } from "@tanstack/react-router"
import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  CircleArrowDown,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  CircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  FilterIcon,
  MessageSquareIcon,
} from "lucide-react"
import { useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import metricsData from "@/data/metrics.json"

import tokensData from "@/data/tokens.json"
import { cn } from "@/lib/utils"

// Types
type CriteriaStatus = "positive" | "neutral" | "at_risk"

interface Evidence {
  id: string
  title: string
  url: string
  comment?: string
}

interface Criteria {
  id: string
  name: string
  status: CriteriaStatus
  description?: string
  evidences?: Evidence[]
}

interface Metric {
  id: string
  name: string
  description: string
  evidenceEntries: number
  positive: number
  neutral: number
  atRisk: number
  criteria: Criteria[]
  aboutLink?: string
}

interface TokenInfo {
  name: string
  symbol: string
  address: string
  icon?: string
  description: string
  network: string
  evidenceEntries: number
  positive: number
  neutral: number
  atRisk: number
  lastUpdated: string
  updatedBy: {
    name: string
    avatar?: string
  }
  links: {
    website?: string
    twitter?: string
    basescan?: string
  }
  infoDescription: string
}

// Helper to get metrics by token ID
function getMetricsByTokenId(tokenId: string): Metric[] {
  const metrics = metricsData[tokenId as keyof typeof metricsData]
  if (!metrics) return []
  return metrics as Metric[]
}

// Helper to get token by ID
function getTokenById(tokenId: string): TokenInfo | null {
  const token = tokensData.tokens.find((t) => t.id === tokenId)
  if (!token) return null
  return token as TokenInfo
}

// Token Hero Section
function TokenHero({ token }: { token: TokenInfo }) {
  return (
    <section className="py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Tokens</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{token.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarImage alt={token.name} src={token.icon} />
          <AvatarFallback className="bg-blue-500 text-white">
            {token.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{token.name}</h1>
      </div>

      <p className="mt-4 max-w-4xl text-muted-foreground">
        {token.description}
      </p>

      {/* Stats row */}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 text-sm">
        <div className="flex-wrap text-muted-foreground">
          <span className="font-semibold">{token.name}</span> has{" "}
          <Badge className="rounded-sm" variant="outline">
            <span className="font-medium">{token.evidenceEntries}</span>
            <span className="text-muted-foreground">evidence entries</span>
            <MessageSquareIcon className="size-4 text-muted-foreground" />
          </Badge>{" "}
          analysed, leading to{" "}
          <Badge
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 rounded-sm"
            variant="outline"
          >
            <span className="font-medium">{token.positive}</span> Positive
            <CircleArrowUpIcon />
          </Badge>
          <span className="text-muted-foreground">,</span>{" "}
          <Badge
            className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 rounded-sm"
            variant="outline"
          >
            <span className="font-medium">{token.neutral}</span>
            Neutral
            <CircleIcon />
          </Badge>{" "}
          and{" "}
          <Badge
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 rounded-sm"
            variant="outline"
          >
            <span className="font-medium">{token.atRisk}</span>
            At risk
            <CircleArrowDownIcon />
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            Last updated: {token.lastUpdated} by
          </span>
          <Avatar className="size-5">
            <AvatarImage src={token.updatedBy.avatar} />
            <AvatarFallback className="text-xs">
              {token.updatedBy.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">
            {token.updatedBy.name}
          </span>
        </div>
      </div>
    </section>
  )
}

// Info Sidebar
function InfoSidebar({ token }: { token: TokenInfo }) {
  return (
    <aside className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">Info</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {token.infoDescription}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="gap-1.5" size="sm" variant="outline">
          <CopyIcon className="size-3.5" />
          {token.address}
        </Button>
        {token.links.basescan && (
          <Button
            className="gap-1.5"
            render={
              <a
                href={token.links.basescan}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="sm"
            variant="outline"
          >
            <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
              <title>BaseScan</title>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            BaseScan
          </Button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {token.links.website && (
          <Button
            className="gap-1.5"
            render={
              <a
                aria-label="Visit website"
                href={token.links.website}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="sm"
            variant="outline"
          >
            <ExternalLinkIcon className="size-3.5" />
            Website
          </Button>
        )}
        {token.links.twitter && (
          <Button
            className="gap-1.5"
            render={
              <a
                aria-label="Visit Twitter profile"
                href={token.links.twitter}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="sm"
            variant="outline"
          >
            <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
              <title>Twitter</title>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </Button>
        )}
      </div>
    </aside>
  )
}

// Metric Card
function MetricCard({ metric }: { metric: Metric }) {
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
            <MessageSquareIcon className="size-4 text-muted-foreground" />
          </Badge>
          <Badge
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 rounded-sm"
            variant="outline"
          >
            <span className="font-medium">{metric.positive}</span> Positive
            <CircleArrowUpIcon />
          </Badge>
          {metric.neutral > 0 && (
            <Badge
              className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 rounded-sm"
              variant="outline"
            >
              <span className="font-medium">{metric.neutral}</span> Neutral
              <CircleIcon />
            </Badge>
          )}
          {metric.atRisk > 0 && (
            <Badge
              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 rounded-sm"
              variant="outline"
            >
              <span className="font-medium">{metric.atRisk}</span> At risk
              <CircleArrowDownIcon />
            </Badge>
          )}
        </div>
      </div>

      {/* Criteria list */}
      <Accordion className="border-t" multiple>
        {metric.criteria.map((criteria) => (
          <AccordionItem key={criteria.id} value={criteria.id}>
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">{criteria.name}</span>
                <Badge
                  className={cn(
                    "rounded-sm mr-2",
                    criteria.status === "positive" &&
                      "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
                    criteria.status === "neutral" &&
                      "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200",
                    criteria.status === "at_risk" &&
                      "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                  )}
                  variant="outline"
                >
                  {criteria.status === "positive" && (
                    <>
                      Positive
                      <CircleArrowUpIcon />
                    </>
                  )}
                  {criteria.status === "neutral" && (
                    <>
                      Neutral
                      <CircleIcon />
                    </>
                  )}
                  {criteria.status === "at_risk" && (
                    <>
                      At risk
                      <CircleArrowDownIcon />
                    </>
                  )}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {criteria.description && (
                <p className="mb-3 text-sm text-muted-foreground">
                  {criteria.description}
                </p>
              )}
              {criteria.evidences && criteria.evidences.length > 0 && (
                <div className="space-y-2">
                  {criteria.evidences.map((evidence) => (
                    <Item key={evidence.id} variant="outline">
                      <ItemContent>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {evidence.title}
                          </span>
                          <span className="text-muted-foreground text-sm truncate">
                            {evidence.url.replace("https://", "")}
                          </span>
                        </div>
                        {evidence.comment && (
                          <ItemDescription>{evidence.comment}</ItemDescription>
                        )}
                      </ItemContent>
                      <ItemActions>
                        <Button
                          className="gap-1.5"
                          render={
                            <a
                              className="no-underline!"
                              href={evidence.url}
                              rel="noopener noreferrer"
                              target="_blank"
                            />
                          }
                          size="sm"
                          variant="outline"
                        >
                          <ArrowUpRightIcon className="size-3.5" />
                          Open
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </div>
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

// Analytics Content
function AnalyticsContent({ metrics }: { metrics: Metric[] }) {
  const [filterValue, setFilterValue] = useState("")
  const [viewBy, setViewBy] = useState("metric")

  return (
    <div className="space-y-4">
      {/* Filter bar */}
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
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  )
}

// Main Component
interface TokenDetailProps {
  tokenId: string
}

export default function TokenDetail({ tokenId }: TokenDetailProps) {
  const token = getTokenById(tokenId)
  const metrics = getMetricsByTokenId(tokenId)

  if (!token) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12">
          <h1 className="text-2xl font-bold">Token not found</h1>
          <p className="mt-2 text-muted-foreground">
            The token with ID "{tokenId}" could not be found.
          </p>
          <Link
            className="mt-4 inline-block text-blue-600 hover:underline"
            to="/"
          >
            ← Back to tokens
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* White background section - Hero */}
      <div className="bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <TokenHero token={token} />
        </div>
      </div>

      {/* Gray background section - Content */}
      <div className="bg-muted/50 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-[1fr_300px]">
            {/* Left column - Tabs and metrics */}
            <div>
              <Tabs defaultValue="analytics">
                <TabsList>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="version-log">Version log</TabsTrigger>
                </TabsList>

                <TabsContent className="mt-4" value="analytics">
                  <AnalyticsContent metrics={metrics} />
                </TabsContent>

                <TabsContent className="mt-4" value="version-log">
                  <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-background">
                    <span className="text-muted-foreground">
                      Version log content
                    </span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Info sidebar */}
            <div className="lg:mt-12">
              <InfoSidebar token={token} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
