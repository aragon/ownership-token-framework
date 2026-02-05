import { createFileRoute } from "@tanstack/react-router"
import TokenOwnershipAnalytics from "@/components/token-ownership-analytics"
import { generateOpenGraphMetadata } from "@/lib/metadata"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "Ownership Token Framework",
      description:
        "The Ownership Token Framework maps enforceable claims across four metrics: onchain control, value accrual, verifiability, and token distribution. Use it to evaluate tokens on fundamentals.",
      twitterCard: "summary_large_image",
    }),
  }),
  component: App,
})

function App() {
  return <TokenOwnershipAnalytics />
}
