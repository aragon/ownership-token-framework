import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeEvaluationVariants = cva(
  "inline-flex h-[28px] items-center justify-center whitespace-nowrap rounded-lg border bg-white px-2 text-base font-normal leading-6",
  {
    variants: {
      variant: {
        positive: "border-green-300 text-green-700",
        negative: "border-yellow-300 text-yellow-700",
        notEvaluated: "border-gray-300 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "notEvaluated",
    },
  }
)

export interface BadgeEvaluationProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeEvaluationVariants>, "variant"> {
  passing: number
  evaluated: number
  className?: string
}

function getVariant(
  passing: number,
  evaluated: number
): "positive" | "negative" | "notEvaluated" {
  if (evaluated === 0) return "notEvaluated"
  if (passing / evaluated >= 0.75) return "positive"
  return "negative"
}

function BadgeEvaluation({
  passing,
  evaluated,
  className,
  ...props
}: BadgeEvaluationProps) {
  const variant = getVariant(passing, evaluated)
  const label =
    variant === "notEvaluated" ? "Not evaluated" : `${passing} of ${evaluated}`

  return (
    <span
      className={cn(badgeEvaluationVariants({ variant }), className)}
      {...props}
    >
      {label}
    </span>
  )
}

export { BadgeEvaluation, badgeEvaluationVariants }
