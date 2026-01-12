import faqData from "@/data/faq.json"
import frameworkData from "@/data/framework.json"

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

function getFrameworkTopics(): FaqTopic[] {
  return frameworkData
    .filter((metric) => metric.id === "gov-fdn")
    .map((metric) => ({
      id: metric.id,
      name: metric.name,
      about: metric.about,
      questions: metric.criteria.slice(0, 2).map((criteria) => ({
        id: criteria.id,
        question:
          criteria.id === "gov-fdn__workflow"
            ? "How does on-chain workflow control keep governance power visible?"
            : "Why should access control flow through holders?",
        answer:
          criteria.id === "gov-fdn__workflow"
            ? "We look for a real, enforceable chain of authority: who can propose, who can veto, who can execute, and how long the system can be paused or delayed. A good workflow feels boring on purpose: clear checkpoints, public timelines, and minimal backdoors. If the flow is legible, ownership has a backbone; if it is vague, ownership is mostly narrative."
            : "It is not enough to say governance exists; it has to actually touch the keys. We map every privileged role to a holder-controlled path, then ask how revocations happen in practice. The goal is not to eliminate all admin roles, but to ensure every meaningful permission can be reached, amended, or removed by tokenholders.",
      })),
    }))
}

export function getFaqTopics(): FaqTopic[] {
  const baseTopics = faqData.topics as FaqTopic[]
  const introTopic = baseTopics.find((topic) => topic.id === "intro")
  const submissionTopic = baseTopics.find((topic) => topic.id === "submission")
  const extraTopics = baseTopics.filter(
    (topic) => topic.id !== "intro" && topic.id !== "submission"
  )

  return [
    ...(introTopic ? [introTopic] : []),
    ...extraTopics,
    ...getFrameworkTopics(),
    ...(submissionTopic ? [submissionTopic] : []),
  ]
}
