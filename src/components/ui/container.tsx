import { cn } from "@/lib/utils"

type ContainerProps = React.ComponentPropsWithoutRef<"div">

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 lg:px-12", className)}
      {...props}
    />
  )
}
