"use client"

import { PageWrapper } from "@/components/page-wrapper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/ui/container"
import { useFaqTopics } from "@/hooks/use-faq"
import ReactMarkdown from "react-markdown"

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
