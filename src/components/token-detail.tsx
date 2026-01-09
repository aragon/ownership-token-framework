import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import metricsData from "@/data/metrics.json"
import tokensData from "@/data/tokens.json"
import AnalyticsContent from "./analytics-content"
import InfoSidebar from "./info-sidebar"

// Types
export type CriteriaStatus = "positive" | "neutral" | "at_risk" | "tbd"

interface Evidence {
  name: string
  url: string
}

interface Criteria {
  id: string
  name: string
  about: string
  status: string
  notes: string
  evidence: Evidence[]
}

export interface Metric {
  id: string
  name: string
  about: string
  criteria: Criteria[]
}

// Map emoji status to internal status type
export function mapStatus(status: string): CriteriaStatus {
  switch (status) {
    case "✅":
      return "positive"
    case "⚠️":
      return "neutral"
    case "❌":
      return "at_risk"
    default:
      return "tbd"
  }
}

export interface TokenInfo {
  id: string
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
    scan?: string
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
      <div className="mt-6 flex flex-wrap items-baseline text-sm">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">
            Last updated: {token.lastUpdated} by
          </span>
          <Avatar className="size-5">
            <AvatarImage
              className="rounded-full"
              src={token.updatedBy.avatar}
            />
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
            className="mt-4 inline-block text-chart-4 hover:underline"
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
              <AnalyticsContent metrics={metrics} />
              {/* <Tabs defaultValue="analytics">
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
              </Tabs> */}
            </div>

            {/* Right column - Info sidebar */}
            <div>
              <div className="sticky top-6">
                <InfoSidebar token={token} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
