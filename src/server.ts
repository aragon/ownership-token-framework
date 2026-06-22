import type { Register } from "@tanstack/react-router"
import {
  createStartHandler,
  defaultStreamHandler,
  type RequestHandler,
} from "@tanstack/react-start/server"
import { isBlockedPathname } from "@/lib/url-guard"

// Custom server entry (replaces the default `createServerEntry`) so we can
// reject malformed request URLs before TanStack Router runs. See url-guard.ts
// for why: the router's canonicalization redirect loops forever on paths
// containing characters like " < > that don't round-trip through encoding.
const handler = createStartHandler(defaultStreamHandler)

const fetch: RequestHandler<Register> = (request, ...rest) => {
  const { pathname } = new URL(request.url)

  if (isBlockedPathname(pathname)) {
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }

  return handler(request, ...rest)
}

export default { fetch }
