import { TanStackDevtools } from "@tanstack/react-devtools"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { Suspense } from "react"
import { ErrorPage } from "@/components/error-page"
import { GoogleAnalytics } from "@/components/google-analytics"
import { NewsletterBanner } from "@/components/newsletter-banner"
import { NotFound } from "@/components/not-found"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"
import { generateOpenGraphMetadata } from "@/lib/metadata"
import {
  publishedFrameworkQuery,
  publishedIndexQuery,
  readPublished,
} from "@/lib/published-queries"
import { queryClient } from "@/lib/query-client"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  // Every page reads the published index (header search, dashboard) and the
  // framework doc (header link, metric cards) synchronously from the query
  // cache — ensure them before render, on server and client alike.
  loader: async () => {
    await Promise.all([
      readPublished(queryClient, publishedIndexQuery),
      readPublished(queryClient, publishedFrameworkQuery),
    ])
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...generateOpenGraphMetadata(),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  notFoundComponent: NotFound,
})

function RootComponent() {
  // Observe the always-needed published queries at the root so they stay
  // cached (never garbage-collected while the app is mounted) and revalidate in
  // the background (SWR). The synchronous readers (token-data / framework) then
  // always find them present; an empty cache fetches-and-suspends here — caught
  // by the Suspense boundary in RootDocument — instead of throwing downstream.
  useSuspenseQuery(publishedIndexQuery)
  useSuspenseQuery(publishedFrameworkQuery)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <NewsletterBanner />
      <Outlet />
      <SiteFooter />
      <GoogleAnalytics />
    </div>
  )
}

function PublishedDataFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const gaId = GA_MEASUREMENT_ID
  // Validate GA4 measurement ID format to prevent XSS!
  const isValidGaId = /^G-[A-Z0-9]+$/.test(gaId)
  const gaScript = isValidGaId
    ? `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { send_page_view: false });`
    : null

  return (
    <html lang="en">
      <head>
        <HeadContent />
        {isValidGaId ? (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        ) : null}
        {gaScript ? <script>{gaScript}</script> : null}
      </head>
      <body>
        <Suspense fallback={<PublishedDataFallback />}>{children}</Suspense>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
