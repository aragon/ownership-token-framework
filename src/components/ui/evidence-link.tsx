import { ExternalLinkIcon, FileTextIcon, GithubIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface IEvidenceLinkProps extends ComponentProps<"a"> {
  type?: "generic" | "github" | "docs" | "explorer"
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
        "inline-flex items-center gap-1 text-sm font-normal leading-5",
        "text-[#0588f0] underline decoration-solid",
        "hover:text-[#0d74ce]",
        "active:text-[#113264]",
        "transition-colors duration-200",
        className
      )}
      {...otherProps}
    >
      {renderIcon()}
      {children}
    </a>
  )
}
