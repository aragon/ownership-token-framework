import { Container } from "@/components/ui/container"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <Container className="flex h-20 items-center justify-between gap-4 lg:gap-12">
        <a
          className="flex items-center gap-2 shrink-0"
          href="https://aragon.org"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="Aragon"
            className="h-6"
            src="/logo-aragon.svg"
            style={{ width: "96.75px" }}
          />
        </a>

        {/* Navigation Links */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://app.aragon.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Launch app
          </a>
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://twitter.com/AragonProject"
            rel="noopener noreferrer"
            target="_blank"
          >
            X
          </a>
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://github.com/aragon/ownership-token-index"
            rel="noopener noreferrer"
            target="_blank"
          >
            Github
          </a>
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://aragon.org/terms-and-conditions"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms of service
          </a>
        </nav>

        {/* Copyright */}
        <div className="flex items-center shrink-0">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            © 2026 Aragon
          </span>
        </div>
      </Container>
    </footer>
  )
}
