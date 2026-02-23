import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Container } from "@/components/ui/container"
import { testimonialsContent } from "@/lib/testimonials-data"
import { cn } from "@/lib/utils"

function TestimonialCard({
  name,
  organization,
  avatar,
  quote,
  url,
  className,
}: {
  name: string
  organization: string
  avatar: string
  quote: string
  url: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border/70 bg-background p-5 shadow-sm md:p-8",
        className,
      )}
    >
      <div className="flex items-start gap-2 text-foreground">
        <span className="w-4 text-2xl leading-8 font-bold text-primary md:w-6 md:text-4xl md:leading-10">
          &ldquo;
        </span>
        <p className="text-base leading-6 text-foreground md:text-lg md:leading-7">
          {quote}
        </p>
      </div>

      <div className="mt-4 pl-6 md:mt-6 md:pl-8">
        <a
          aria-label={`${name} at ${organization} (opens in new tab)`}
          className="inline-flex items-center gap-3 rounded-md focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Avatar className="size-10 md:size-12">
            <AvatarImage alt={name} src={avatar} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-foreground md:text-base md:leading-6">
              {name}
            </span>
            <span className="text-xs leading-4 text-muted-foreground md:text-sm md:leading-5">
              {organization}
            </span>
          </div>
        </a>
      </div>
    </article>
  )
}

export function TestimonialsSection() {
  const { title, testimonials } = testimonialsContent

  return (
    <section className="bg-muted/50">
      <Container className="py-10 md:py-20">
        <div className="flex flex-col gap-8 md:gap-10">
          <h2 className="text-center text-3xl leading-9 font-bold tracking-tight text-accent-foreground md:text-4xl md:leading-10">
            {title}
          </h2>

          <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2">
            {testimonials.map(({ id, ...rest }) => (
              <TestimonialCard key={id} {...rest} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
