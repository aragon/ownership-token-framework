import { useMemo } from "react"
import { type FaqTopic, getFaqTopics } from "@/lib/faq-data"

export function useFaqTopics(): FaqTopic[] {
  return useMemo(() => getFaqTopics(), [])
}
