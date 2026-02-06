import { Link } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { trackExpandAllCriteria } from "@/lib/analytics"
import { getMetricsByTokenId, type Metric } from "@/lib/metrics-data"
import { getTokenById } from "@/lib/token-data"
import { formatUnixTimestamp } from "@/lib/utils"
import AnalyticsContent from "./analytics-content"
import InfoSidebar from "./info-sidebar"
import { NewsletterSignup } from "./newsletter-signup.tsx"

// Types
export type CriteriaStatus = "positive" | "neutral" | "at_risk" | "tbd"

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
  lastUpdated: number
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

export type { Metric }

// Token Hero Section
function TokenHero({ token }: { token: TokenInfo }) {
  return (
    <section className="py-6 flex flex-col gap-4 md:gap-6">
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

      <div className="flex items-start gap-3">
        <Avatar className="size-8 md:size-10">
          <AvatarImage alt={token.name} src={token.icon} />
          <AvatarFallback className="bg-blue-500 text-white">
            {token.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold md:text-3xl">{token.name}</h1>
      </div>

      <p className="max-w-4xl text-muted-foreground">{token.description}</p>

      {/* Stats row */}
      <div className="flex flex-wrap items-baseline text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            Last updated: {formatUnixTimestamp(token.lastUpdated)} by
          </span>
          <div className="flex gap-x-1 items-center">
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

  const allCriteriaIds = useMemo(
    () => metrics.flatMap((metric) => metric.criteria.map((c) => c.id)),
    [metrics]
  )

  const [openCriteria, setOpenCriteria] = useState<string[]>([])
  const allOpen = openCriteria.length === allCriteriaIds.length

  const handleToggleAll = () => {
    // If all closed → Expand all criterias
    // If all open → Close all criterias
    // If some open → Expand all criterias
    const action = allOpen ? "collapse" : "expand"
    trackExpandAllCriteria(action)
    setOpenCriteria(allOpen ? [] : allCriteriaIds)
  }

  if (!token) {
    return (
      <PageWrapper className="bg-background">
        <Container className="py-12">
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
        </Container>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* White background section - Hero */}
      <div className="bg-background">
        <Container>
          <TokenHero token={token} />
        </Container>
      </div>

      {/* Gray background section - Content */}
      <div className="bg-muted/50 flex-1">
        <Container>
          <div className="grid grid-cols-1 gap-6 pt-6 pb-10 md:pt-12 md:pb-20 lg:grid-cols-[1fr_300px]">
            {/* Left column - Tabs and metrics */}

            <AnalyticsContent
              metrics={metrics}
              onOpenCriteriaChange={setOpenCriteria}
              openCriteria={openCriteria}
            />
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

            {/* Right column - Info sidebar */}
            <div>
              <div className="sticky top-6 flex flex-col gap-6">
                <InfoSidebar token={token} />
                <Button
                  className="w-full"
                  onClick={handleToggleAll}
                  variant="outline"
                >
                  {allOpen ? "Close all criteria" : "Expand all criteria"}
                </Button>
              </div>
            </div>
          </div>
        </Container>
        <NewsletterSignup />
      </div>
    </PageWrapper>
  )
}
