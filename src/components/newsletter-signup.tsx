"use client"

import { SignupInput } from "@/components/signup-input"
import { Container } from "@/components/ui/container"

export function NewsletterSignup() {
  return (
    <section className="bg-background">
      <Container className="px-12 py-20">
        <div className="mx-auto flex max-w-[800px] flex-col items-center gap-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-accent-foreground">
              Stay up-to-date on the latest token reports
            </h2>
            <p className="text-lg font-normal text-accent-foreground">
              Get an email when we publish a new token report or release major
              updates to the Index.
            </p>
          </div>

          <div className="flex w-full justify-center">
            <SignupInput
              className="w-full sm:w-auto sm:[&_form]:items-center sm:[&_form]:justify-center"
              messageAlignment="center"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
