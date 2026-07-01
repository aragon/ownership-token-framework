import faqData from "@/data/generated/faq.json"
import type { FaqQuestion, FaqTopic } from "@/lib/schemas"

export type { FaqQuestion, FaqTopic }

export function getFaqTopics(): FaqTopic[] {
  return faqData.topics as FaqTopic[]
}
