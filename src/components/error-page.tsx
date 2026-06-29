import { Link } from "@tanstack/react-router"
import { useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

interface ErrorPageProps {
  error: Error
  // TanStack Router passes a `reset` to retry the failed render/load.
  reset?: () => void
}

/**
 * Root error boundary UI. Without this, any unhandled throw during render or
 * hydration leaves the user on a blank page with no recovery path. Here we
 * show a recoverable screen and log the stack so it reaches platform logs.
 */
export function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[OTF] Unhandled application error:", error)
  }, [error])

  return (
    <PageWrapper className="bg-background">
      <Container className="flex flex-col items-start gap-4 py-16">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-prose text-muted-foreground">
          An unexpected error occurred while loading this page. You can try
          again, or head back to the token list.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              if (reset) {
                reset()
              } else {
                window.location.reload()
              }
            }}
            variant="outline"
          >
            Try again
          </Button>
          <Button render={<Link to="/">Back to tokens</Link>} />
        </div>
      </Container>
    </PageWrapper>
  )
}
