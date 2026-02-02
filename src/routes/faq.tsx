import { createFileRoute } from "@tanstack/react-router"
import UserFaq from "@/components/user-faq"

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      {
        title: "FAQ - Ownership Token Framework",
      },
      {
        name: "description",
        content:
          "Frequently asked questions about the Ownership Token Framework",
      },
    ],
  }),
  component: FaqPage,
})

function FaqPage() {
  return <UserFaq />
}
