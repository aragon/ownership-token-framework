import { createFileRoute } from "@tanstack/react-router"
import UserFaq from "@/components/user-faq"

export const Route = createFileRoute("/faq")({
  component: FaqPage,
})

function FaqPage() {
  return <UserFaq />
}
