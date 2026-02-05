import { createFileRoute } from "@tanstack/react-router"
import UserFaq from "@/components/user-faq"
import { generateOpenGraphMetadata } from "@/lib/metadata"

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "FAQ - Ownership Token Framework",
      description:
        "Frequently asked questions about the Ownership Token Framework, governance evaluation, and token assessment criteria.",
      twitterCard: "summary",
      image: "/og-images/faq.png",
      imageAlt: "Frequently asked questions",
      url: "/faq",
    }),
  }),
  component: FaqPage,
})

function FaqPage() {
  return <UserFaq />
}
