import { cn } from "@/lib/utils"

type PageWrapperProps = React.ComponentPropsWithoutRef<"main">

export function PageWrapper({ className, ...props }: PageWrapperProps) {
  return <main className={cn("flex-1 w-full", className)} {...props} />
}
