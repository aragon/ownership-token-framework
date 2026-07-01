import type { Register } from "@tanstack/react-router"
import {
  createStartHandler,
  defaultStreamHandler,
  type RequestHandler,
} from "@tanstack/react-start/server"
import { isBlockedPathname } from "@/lib/url-guard"

// Custom server entry so we can reject malformed request URLs before TanStack
// Router runs — see url-guard.ts for the canonicalization redirect loop it
// prevents.
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
