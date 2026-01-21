import { SignupInput } from "@/components/signup-input"
import { Container } from "@/components/ui/container"

export function HeroHeader() {
  return (
    <section className="bg-background">
      <Container className="px-12 py-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-10 tracking-tight text-accent-foreground">
            Ownership Token Index
          </h1>
          <div className="max-w-[800px] space-y-7 text-lg leading-7 text-accent-foreground">
            <p>
              A standardized, open-source disclosure framework for token
              investors helps clarify the value a token provides in terms of
              ownership. By utilizing this framework, you can identify the
              metrics and criteria that matter most to you and your investments.
              Improved analytics and clearer ownership lead to smarter
              investment decisions.
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
