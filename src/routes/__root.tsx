import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { GoogleAnalytics } from "@/components/google-analytics"
import { NewsletterBanner } from "@/components/newsletter-banner"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Ownership Token Framework",
      },
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
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <NewsletterBanner />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <GoogleAnalytics />
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
        <title>Ownership Token Framework</title>
        {isValidGaId ? (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        ) : null}
        {gaScript ? <script>{gaScript}</script> : null}
      </head>
      <body>
        {children}
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
