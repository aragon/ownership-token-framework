"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { match } from "ts-pattern"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
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

interface ISignupInputProps {
  messageAlignment?: "left" | "center"
  className?: string
}

export function SignupInput(props: ISignupInputProps) {
  const { messageAlignment = "center", className } = props

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
  }, [status, form.reset])

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
    <div className={cn("w-full space-y-3", className)}>
      <form
        className="flex w-full flex-col items-start gap-2 sm:flex-row"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => {
            const isInvalid = fieldState.invalid
            return (
              <Field className="w-full sm:w-80" data-invalid={isInvalid}>
                <Input
                  {...field}
                  aria-invalid={isInvalid}
                  aria-label="Email address"
                  autoComplete="email"
                  className="h-9 w-full rounded-md bg-background shadow-sm"
                  data-invalid={isInvalid}
                  disabled={status === "submitting"}
                  onChange={(event) => {
                    field.onChange(event)
                    form.clearErrors("email")
                  }}
                  placeholder="you@domain.com"
                  type="email"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="text-left"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )
          }}
        />
        <Button
          className="w-full sm:w-auto"
          disabled={status === "submitting" || status === "success"}
          size="lg"
          type="submit"
          variant={status === "success" ? "success" : "outline"}
        >
          {match(status)
            .with("submitting", () => (
              <>
                <LoaderCircleIcon
                  aria-hidden="true"
                  className="animate-spin"
                  data-icon="inline-start"
                />
                Subscribing
              </>
            ))
            .with("success", () => (
              <>
                <CheckIcon aria-hidden="true" data-icon="inline-start" />
                Subscribed
              </>
            ))
            .with("idle", "error", () => "Notify me")
            .exhaustive()}
        </Button>
      </form>

      {message && (
        <p
          aria-live="polite"
          className={cn(
            "text-sm text-muted-foreground",
            messageAlignment === "center" && "text-center"
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}
