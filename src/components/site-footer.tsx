export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:gap-12 lg:px-12">
        {/* Built by Aragon */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-muted-foreground">Built by</span>
          <img
            alt="Aragon"
            className="h-6"
            src="/logo-aragon.svg"
            style={{ width: "96.75px" }}
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://app.aragon.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Aragon App
          </a>
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://aragon.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Website
          </a>
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://twitter.com/AragonProject"
            rel="noopener noreferrer"
            target="_blank"
          >
            Twitter / X
          </a>
          <a
            className="rounded-md px-4 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted"
            href="https://www.aragon.org/terms-and-conditions"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms of Service
          </a>
        </nav>

        {/* Copyright */}
        <div className="flex items-center shrink-0">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            © 2026 Aragon
          </span>
        </div>
      </div>
    </footer>
  )
}
