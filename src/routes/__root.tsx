import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { GoogleAnalytics } from "@/components/google-analytics"
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
        title: "Ownership Token Index",
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
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <GoogleAnalytics />
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const gaId = GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <head>
        <HeadContent />
        {gaId ? (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        ) : null}
        {gaId ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });`,
            }}
          />
        ) : null}
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
