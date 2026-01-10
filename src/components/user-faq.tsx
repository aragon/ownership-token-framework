"use client"

import { PageWrapper } from "@/components/page-wrapper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/ui/container"
import frameworkData from "@/data/framework.json"
import ReactMarkdown from "react-markdown"

// Hero Section
function HeroSection() {
  return (
    <section className="flex flex-col gap-y-4 py-8 lg:py-12">
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="max-w-[1024px] text-muted-foreground">
        Quick answers on how the index works, how to interpret the framework,
        and what to expect when submitting a token.
      </p>
    </section>
  )
}

interface FaqQuestion {
  id: string
  question: string
  answer: string
}

interface FaqTopic {
  id: string
  name: string
  about?: string
  questions: FaqQuestion[]
}

function buildFaqTopics(): FaqTopic[] {
  const introTopic: FaqTopic = {
    id: "intro",
    name: "Overview",
    about:
      "The Ownership Token Index is an MVP dashboard for evaluating the credibility and worthiness of token ownership across protocols.",
    questions: [
      {
        id: "intro__purpose",
        question: "What is the purpose of the Ownership Token Index?",
        answer:
          "To establish whether holding a token provides meaningful ownership rights in a protocol, or if the claim is mostly speculative. We use a standardized framework so results are comparable across projects.",
      },
      {
        id: "intro__target-users",
        question: "Who is this for?",
        answer:
          "Crypto investors, governance participants, analysts, and researchers who want an objective view of token ownership quality.",
      },
    ],
  }

  const frameworkTopics = frameworkData
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

  const submissionTopic: FaqTopic = {
    id: "submission",
    name: "Submission",
    about: "How tokens are proposed, reviewed, and added to the index.",
    questions: [
      {
        id: "submission__how",
        question: "How do I submit a token for analysis?",
        answer:
          "Use the submit flow to share a token, its contract address, and a short description of why it matters. We review each submission for completeness and scope before adding it to the index.",
      },
      {
        id: "submission__what-happens-next",
        question: "What happens after I submit?",
        answer:
          "We confirm the details, perform an initial review using the framework, and publish a write-up once the evidence is verified. You will hear from us when it is ready.",
      },
      {
        id: "submission__where-does-it-go",
        question: "Where does the submission go internally?",
        answer:
          "Submissions are logged for the team to triage and track. That keeps the workflow consistent while we gather sources and prepare the analysis.",
      },
    ],
  }

  return [
    introTopic,
    ...frameworkTopics,
    submissionTopic,
  ]
}

export default function UserFaq() {
  const topics = buildFaqTopics()

  return (
    <PageWrapper>
      <div className="bg-background">
        <Container>
          <HeroSection />
        </Container>
      </div>

      <div className="bg-muted/50 flex-1">
        <Container>
          <div className="space-y-6 pb-20 pt-10">
            {topics.map((topic) => (
              <section
                className="rounded-lg border bg-card gap-y-4 flex flex-col"
                key={topic.id}
              >
                <div className="p-4 pb-0">
                  <h2 className="font-semibold">{topic.name}</h2>
                  {topic.about ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {topic.about}
                    </p>
                  ) : null}
                </div>

                <Accordion
                  className="border rounded-md w-auto m-6 mt-0"
                  multiple
                >
                  {topic.questions.map((item) => (
                    <AccordionItem
                      className="mx-6 p-0"
                      key={item.id}
                      value={item.id}
                    >
                      <AccordionTrigger className="py-3 hover:no-underline gap-x-1 items-center">
                        <span className="text-sm">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                          <ReactMarkdown>{item.answer}</ReactMarkdown>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </Container>
      </div>
    </PageWrapper>
  )
}
