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
  total: number
  evaluated?: boolean
  reference?: boolean
  className?: string
}

function getVariant(
  passing: number,
  total: number,
  evaluated: boolean
): "positive" | "negative" | "notEvaluated" {
  if (!evaluated || total === 0) return "notEvaluated"
  if (passing / total >= 0.75) return "positive"
  return "negative"
}

function BadgeEvaluation({
  passing,
  total,
  evaluated = true,
  reference = false,
  className,
  ...props
}: BadgeEvaluationProps) {
  const variant = reference
    ? "notEvaluated"
    : getVariant(passing, total, evaluated)
  const label = reference
    ? "Reference"
    : variant === "notEvaluated"
      ? "Not evaluated"
      : `${passing} of ${total}`

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
