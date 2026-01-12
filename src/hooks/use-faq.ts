import { useMemo } from "react"
import { getFaqTopics, type FaqTopic } from "@/lib/faq-data"

export function useFaqTopics(): FaqTopic[] {
  return useMemo(() => getFaqTopics(), [])
}
