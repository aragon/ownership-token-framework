import { ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type LinkProps = React.ComponentPropsWithoutRef<"a"> & {
  isExternal?: boolean
}

export function Link({ className, isExternal, children, ...props }: LinkProps) {
  return (
    <a
      className={cn("inline-flex items-center gap-2", className)}
      rel={isExternal ? "noreferrer noopener" : props.rel}
      target={isExternal ? "_blank" : props.target}
      {...props}
    >
      {children}
      {isExternal ? <ExternalLinkIcon className="size-3.5" /> : null}
    </a>
  )
}
