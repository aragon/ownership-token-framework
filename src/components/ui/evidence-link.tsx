import { ExternalLinkIcon, FileTextIcon, GithubIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export type EvidenceLinkType = "generic" | "github" | "docs" | "explorer"

interface IEvidenceLinkProps extends ComponentProps<"a"> {
  type?: EvidenceLinkType
}

export const EvidenceLink: React.FC<IEvidenceLinkProps> = (props) => {
  const { type = "generic", className, children, ...otherProps } = props

  const renderIcon = () => {
    switch (type) {
      case "github":
        return <GithubIcon className="size-[10.667px] shrink-0" />
      case "docs":
        return <FileTextIcon className="size-[10.667px] shrink-0" />
      case "explorer":
        return <ExternalLinkIcon className="size-4 shrink-0" />
      default:
        return null
    }
  }

  return (
    <a
      className={cn(
        "inline-flex items-center gap-1 text-base font-normal leading-6 tracking-normal",
        "text-chart-3 underline decoration-solid",
        "hover:text-chart-4",
        "active:text-chart-5",
        "transition-colors duration-200",
        className
      )}
      rel="noopener noreferrer"
      target="_blank"
      {...otherProps}
    >
      {renderIcon()}
      {children}
    </a>
  )
}
