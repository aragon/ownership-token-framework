import { FileTextIcon, GithubIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cn, isPlaceholder } from "@/lib/utils"
import { ExplorerIcon } from "./explore-icon.tsx"

export type EvidenceLinkType =
  | "github"
  | "docs"
  | "explorer"
  | "vote"
  | "website"

interface IEvidenceLinkProps extends ComponentProps<"a"> {
  type?: EvidenceLinkType
}

export const EvidenceLink: React.FC<IEvidenceLinkProps> = (props) => {
  const { type = "generic", className, children, href, ...otherProps } = props

  // A "TK"/empty href is a placeholder from a WIP token — never emit a dead
  // link (callers already filter these out; this is a defensive guard).
  if (isPlaceholder(href)) {
    return null
  }

  const renderIcon = () => {
    switch (type) {
      case "github":
        return <GithubIcon className="size-4 shrink-0 mt-1" />
      case "docs":
        return <FileTextIcon className="size-4 shrink-0 mt-1" />
      case "explorer":
        return <ExplorerIcon className="mt-1" />
      default:
        return null
    }
  }

  return (
    <a
      className={cn(
        "inline-flex items-start gap-1 text-base font-normal leading-6 tracking-normal",
        "text-chart-3 underline decoration-solid",
        "hover:text-chart-4!",
        "active:text-chart-5!",
        "transition-colors duration-200",
        className
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...otherProps}
    >
      {renderIcon()}
      {children}
    </a>
  )
}
