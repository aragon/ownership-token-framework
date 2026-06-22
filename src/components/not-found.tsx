import { Link as NavLink, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

/**
 * Rendered for any unmatched route. This does NOT throw a redirect, so the
 * server still responds with a real 404 status — that's what tells search
 * engines the URL does not exist and gets malformed/garbage paths dropped from
 * the index (instead of a 307 soft-redirect that keeps them alive).
 *
 * For real users, a client-side effect navigates home after hydration, so the
 * 404 is effectively invisible in the browser. Crawlers (and no-JS clients)
 * still see the 404 page and status below.
 */
export function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: "/", replace: true })
  }, [navigate])

  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button className="mt-2" render={<NavLink to="/" />}>
        Back to homepage
      </Button>
    </Container>
  )
}
