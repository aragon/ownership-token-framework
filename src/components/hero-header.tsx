import { Container } from "@/components/ui/container"

export function HeroHeader() {
  return (
    <section className="bg-background">
      <Container className="py-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-10 tracking-tight text-accent-foreground md:text-4xl">
            Verify and compare enforceable ownership
          </h1>
          <div className="max-w-[800px] space-y-7 text-lg leading-7 text-accent-foreground">
            <p>
              The Ownership Token Framework maps enforceable claims across four
              metrics: onchain control, value accrual, verifiability, and token
              distribution. Use it to evaluate tokens on fundamentals.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
