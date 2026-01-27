import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { CircleHelpIcon } from "lucide-react"
import { ComponentPropsWithoutRef } from "react"

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

  const TitleTag = variant

  return (
    <PreviewCardPrimitive.Root>
      <div
        className={cn("inline-flex items-center gap-2", className)}
        {...otherProps}
      >
        <PreviewCardPrimitive.Trigger className="inline-flex items-center gap-2 text-foreground no-underline outline-none">
          <TitleTag
            className={cn(
              "font-sans not-italic underline decoration-dotted",
              variant === "h3" && "text-lg font-bold leading-7",
              variant === "h4" && "text-base font-medium leading-6"
            )}
          >
            {title}
          </TitleTag>
          <CircleHelpIcon className="size-[10.667px] shrink-0 text-muted-foreground transition-colors group-hover:text-[#0588f0]" />
        </PreviewCardPrimitive.Trigger>

        <PreviewCardPrimitive.Portal>
          <PreviewCardPrimitive.Positioner
            align="start"
            alignOffset={0}
            className="isolate z-50"
            side="bottom"
            sideOffset={8}
          >
            <PreviewCardPrimitive.Popup className="data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-80 origin-(--transform-origin) rounded-md border border-border bg-popover p-4 shadow-md outline-hidden duration-100">
              <div className="flex w-full flex-col items-start gap-0">
                <div className="flex w-full items-center pb-1">
                  <p className="font-sans text-base font-medium leading-6 text-foreground">
                    {title}
                  </p>
                </div>
                <div className="flex w-full items-center justify-center">
                  <p className="min-h-px min-w-px flex-1 font-sans text-sm font-normal leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
                {learnMoreLink && (
                  <div className="flex w-full items-center pt-4">
                    <Link
                      className="font-sans text-sm font-normal leading-5 text-[#0588f0]"
                      href={learnMoreLink}
                      isExternal
                      hideExternalIcon
                    >
                      Learn more about this {variant === "h3" ? "metric" : "criteria"} →
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
