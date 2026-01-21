import type { ComponentProps } from "react"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

interface IFooterLinkProps extends ComponentProps<"a"> {
  href: string
  children: React.ReactNode
}

const FooterLink: React.FC<IFooterLinkProps> = (props) => {
  const { href, children, className, ...otherProps } = props

  return (
    <a
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
        className
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...otherProps}
    >
      {children}
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <Container className="flex h-auto lg:h-20 flex-col lg:flex-row items-center justify-between gap-4 lg:gap-12 py-4 lg:py-0">
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
        <nav className="flex flex-col lg:flex-row lg:flex-1 items-center justify-center gap-1 w-full lg:w-auto">
          <FooterLink href="https://app.aragon.org">Aragon App</FooterLink>
          <FooterLink href="https://aragon.org">Website</FooterLink>
          <FooterLink href="https://twitter.com/AragonProject">
            Twitter/X
          </FooterLink>
          <FooterLink href="https://github.com/aragon/ownership-token-index">
            Github
          </FooterLink>
          <FooterLink href="https://aragon.org/terms-and-conditions">
            Terms of service
          </FooterLink>
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
