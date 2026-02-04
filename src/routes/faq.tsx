import { createFileRoute } from "@tanstack/react-router"
import { generateOpenGraphMetadata } from "@/lib/metadata"
import UserFaq from "@/components/user-faq"

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "FAQ - Ownership Token Framework",
      description:
        "Frequently asked questions about the Ownership Token Framework, governance evaluation, and token assessment criteria.",
      twitterCard: "summary",
    }),
  }),
  component: FaqPage,
})

function FaqPage() {
  return <UserFaq />
}
