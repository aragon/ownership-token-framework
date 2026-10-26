import { StartClient } from "@tanstack/react-start/client"
import { initBotId } from "botid/client/core"
import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"

// Attaches BotID challenge headers to form submissions. Every TanStack Start
// server fn call is a POST to /_serverFn/<id>; GET fns (market data) are not
// covered. The server side is assertHuman() in src/lib/bot-check.ts.
// ponytail: prod builds only. The challenge script is routed by Vercel; in
// `vite dev` it 404s and protected fetches hang. Add a dev proxy to
// api.vercel.com/bot-protection (as botid/next does) if local testing needs it.
if (import.meta.env.PROD) {
  initBotId({ protect: [{ path: "/_serverFn/*", method: "POST" }] })
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})
