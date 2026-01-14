import faqData from "@/data/faq.json"

export interface FaqQuestion {
  id: string
  question: string
  answer: string
}

export interface FaqTopic {
  id: string
  name: string
  about?: string
  questions: FaqQuestion[]
}

export function getFaqTopics(): FaqTopic[] {
  const baseTopics = faqData.topics as FaqTopic[]
  return baseTopics
}
