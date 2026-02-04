"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { PageWrapper } from "@/components/page-wrapper"
import { SubmitTokenDialog } from "@/components/submit-token-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/ui/container"
import { useFaqTopics } from "@/hooks/use-faq"
import { NewsletterSignup } from "./newsletter-signup.tsx"

const SUBMIT_TOKEN_HREF = "submit-token"
const LINK_CLASS_NAME =
  "cursor-pointer text-chart-4 underline decoration-dotted underline-offset-4 hover:text-foreground hover:decoration-solid transition-colors"
const INLINE_BUTTON_CLASS_NAME = `${LINK_CLASS_NAME} bg-transparent p-0 border-0`

interface MarkdownComponentProps {
  children?: React.ReactNode
  href?: string
}

// Hero Section
function HeroSection() {
  return (
    <section className="flex flex-col gap-y-4 py-6 lg:py-12">
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

export default function UserFaq() {
  const topics = useFaqTopics()
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const markdownComponents = {
    a: ({ href, children }: MarkdownComponentProps) => {
      if (href === SUBMIT_TOKEN_HREF) {
        return (
          <button
            className={INLINE_BUTTON_CLASS_NAME}
            onClick={() => setSubmitDialogOpen(true)}
            type="button"
          >
            {children}
          </button>
        )
      }

      return (
        <a
          className={`${LINK_CLASS_NAME} not-prose`}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      )
    },
  }

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
                          <ReactMarkdown components={markdownComponents}>
                            {item.answer}
                          </ReactMarkdown>
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

      <NewsletterSignup />

      <SubmitTokenDialog
        onOpenChange={setSubmitDialogOpen}
        open={submitDialogOpen}
      />
    </PageWrapper>
  )
}
