"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Container } from "./ui/container"

// Hero Section
function HeroSection() {
  return (
    <section className="flex flex-col gap-y-4 py-8 lg:py-12">
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="max-w-[1024px] text-muted-foreground">
        Coming soon. Check back later for answers to common questions about
        token ownership analytics.
      </p>
    </section>
  )
}

export default function UserFaq() {
  return (
    <PageWrapper>
      <Container>
        <HeroSection />
      </Container>
    </PageWrapper>
  )
}
