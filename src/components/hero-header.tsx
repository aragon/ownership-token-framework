import { SignupInput } from "@/components/signup-input"
import { Container } from "@/components/ui/container"

export function HeroHeader() {
  return (
    <section className="bg-background">
      <Container className="px-12 py-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-10 tracking-tight text-accent-foreground">
            Verify and compare enforceable ownership
          </h1>
          <div className="max-w-[800px] space-y-7 text-lg leading-7 text-accent-foreground">
            <p>
              The Ownership Token Framework maps enforceable claims across four metrics: token control, protocol control, value accrual, and offchain dependencies. Use it to evaluate tokens on fundamentals.
            </p>
            <p>
              Get an email when we publish a new token report or release major
              updates to the Index.
            </p>
          </div>
          <SignupInput messageAlignment="left" />
        </div>
      </Container>
    </section>
  )
}
