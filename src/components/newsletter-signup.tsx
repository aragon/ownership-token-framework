"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { newsletterSignupFn } from "@/routes/api.newsletter-signup"

const RESET_DELAY_MS = 10_000
const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
})

type SignupStatus = "idle" | "submitting" | "success" | "error"
type SignupFormData = z.infer<typeof emailSchema>

export function NewsletterSignup() {
  const [status, setStatus] = useState<SignupStatus>("idle")
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const form = useForm<SignupFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (status !== "success" && status !== "error") {
      return
    }

    resetTimerRef.current = setTimeout(() => {
      setStatus("idle")
      setAlreadySubscribed(false)
      form.reset()
    }, RESET_DELAY_MS)

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [status])

  async function onSubmit(data: SignupFormData) {
    setStatus("submitting")
    setAlreadySubscribed(false)

    try {
      const response = await newsletterSignupFn({ data })
      setAlreadySubscribed(Boolean(response.alreadySubscribed))
      setStatus("success")
    } catch (error) {
      setStatus("error")
      console.error("Newsletter signup error:", error)
      form.setError("email", {
        type: "server",
        message: "Unable to complete signup. Please try again later.",
      })
    }
  }

  const message =
    status === "success"
      ? alreadySubscribed
        ? "You're already on the list. Thanks for staying in the loop!"
        : "Thanks for signing up! Please check your inbox to confirm."
      : null

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

          <form
            className="flex w-full flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-center"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => {
                const isInvalid = fieldState.invalid
                return (
                  <Field
                    className="w-full sm:w-80"
                    data-invalid={isInvalid}
                  >
                    <Input
                      {...field}
                      aria-invalid={isInvalid}
                      aria-label="Email address"
                      className="h-9 w-full rounded-md bg-background shadow-sm"
                      data-invalid={isInvalid}
                      disabled={status === "submitting"}
                      autoComplete="email"
                      onChange={(event) => {
                        field.onChange(event)
                        form.clearErrors("email")
                      }}
                      placeholder="you@domain.com"
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-left" errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
            <Button
              className="h-9 w-full px-4 shadow-sm sm:w-auto"
              disabled={status === "submitting"}
              type="submit"
              variant="outline"
            >
              {status === "submitting" ? "Notifying..." : "Notify me"}
            </Button>
          </form>

          {message ? (
            <p aria-live="polite" className="text-sm">
              {message}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
