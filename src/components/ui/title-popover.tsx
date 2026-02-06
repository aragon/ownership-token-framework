import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { CircleHelpIcon } from "lucide-react"
import { type ComponentPropsWithoutRef, useState } from "react"

import { Link } from "@/components/ui/link"
import { cn } from "@/lib/utils"

interface ITitlePopoverProps extends ComponentPropsWithoutRef<"div"> {
  title: string
  description: string
  learnMoreLink?: string
  variant?: "h3" | "h4"
}

const TitlePopover: React.FC<ITitlePopoverProps> = (props) => {
  const {
    title,
    description,
    learnMoreLink,
    variant = "h3",
    className,
    ...otherProps
  } = props

  const [open, setOpen] = useState(false)
  const TitleTag = variant

  return (
    <PreviewCardPrimitive.Root
      defaultOpen={false}
      onOpenChange={setOpen}
      open={open}
    >
      <div
        className={cn(
          "inline-flex items-center cursor-help",
          variant === "h3" ? "gap-2" : "gap-3",
          className
        )}
        {...otherProps}
      >
        <PreviewCardPrimitive.Trigger
          className={cn(
            "group inline-flex items-center text-foreground no-underline outline-none",
            variant === "h3" ? "gap-2" : "gap-3"
          )}
        >
          <TitleTag
            className={cn(
              "font-sans not-italic underline decoration-dotted underline-offset-4",
              variant === "h3" && "text-lg font-bold leading-7",
              variant === "h4" && "text-base font-medium leading-6"
            )}
          >
            {title}
          </TitleTag>
          <CircleHelpIcon
            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-chart-3"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen((prev) => !prev)
            }}
          />
        </PreviewCardPrimitive.Trigger>

        <PreviewCardPrimitive.Portal>
          <PreviewCardPrimitive.Positioner
            align="start"
            alignOffset={0}
            className="isolate z-50"
            side="bottom"
            sideOffset={8}
          >
            <PreviewCardPrimitive.Popup className="data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-80 origin-(--transform-origin) rounded-md border border-border bg-popover p-4 drop-shadow-md shadow-md outline-hidden duration-100">
              <div className="flex w-full flex-col items-start gap-0">
                <div className="flex w-full items-center justify-center">
                  <p className="min-h-px min-w-px flex-1 font-sans text-sm font-normal leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
                {learnMoreLink && (
                  <div className="flex w-full items-center pt-4">
                    <Link
                      className="font-sans text-sm font-normal leading-5 text-chart-3"
                      hideExternalIcon
                      href={learnMoreLink}
                      isExternal
                    >
                      Learn more about this{" "}
                      {variant === "h3" ? "metric" : "criteria"} →
                    </Link>
                  </div>
                )}
              </div>
            </PreviewCardPrimitive.Popup>
          </PreviewCardPrimitive.Positioner>
        </PreviewCardPrimitive.Portal>
      </div>
    </PreviewCardPrimitive.Root>
  )
}

export { TitlePopover }
