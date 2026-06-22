import { Link as NavLink } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

/**
 * Rendered for any unmatched route. It intentionally does NOT redirect:
 * returning a real 404 status (instead of a 307 to "/") tells search engines
 * the URL does not exist so malformed/garbage paths get dropped from the index
 * rather than kept alive as soft-404 redirects.
 */
export function NotFound() {
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
