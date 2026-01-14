"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const submitTokenSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  project: z.string().max(80, "Project name must be at most 80 characters"),
  request: z
    .string()
    .min(10, "Request must be at least 10 characters")
    .max(200, "Request must be at most 200 characters"),
  additionalInfo: z
    .string()
    .min(20, "Additional information must be at least 20 characters")
    .max(500, "Additional information must be at most 500 characters"),
  submitterEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
})

type SubmitTokenFormData = z.infer<typeof submitTokenSchema>

interface SubmitTokenDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SubmitTokenDialog({
  open,
  onOpenChange,
}: SubmitTokenDialogProps) {
  const form = useForm<SubmitTokenFormData>({
    resolver: zodResolver(submitTokenSchema),
    defaultValues: {
      name: "",
      project: "",
      request: "",
      additionalInfo: "",
      submitterEmail: "",
    },
  })
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "submitting" | "error" | "success"
    message?: string
  }>({ status: "idle" })

  useEffect(() => {
    if (!open) {
      setSubmitState({ status: "idle" })
    }
  }, [open])

  useEffect(() => {
    if (submitState.status !== "success") {
      return
    }

    const timeout = setTimeout(() => {
      onOpenChange?.(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [submitState.status, onOpenChange])

  async function onSubmit(data: SubmitTokenFormData) {
    setSubmitState({ status: "submitting" })
    try {
      const response = await fetch("/api/submit-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || "Submission failed. Try again.")
      }
      setSubmitState({ status: "success" })
      form.reset()
      onOpenChange?.(false)
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Submission failed. Try again.",
      })
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create request</DialogTitle>
          <DialogDescription>
            Request a specific token to be evaluated using our framework and to
            be considered for potential inclusion in the Ownership Token
            Framework. We are also interested in any feedback you have that
            could make the Index more helpful for you.
          </DialogDescription>
        </DialogHeader>

        {submitState.status === "success" ? (
          <section className="rounded-lg border bg-muted/30 px-4 py-6">
            <h3 className="text-lg font-semibold">Submission received</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for the submission. We’ll review it and notify you when the
              analysis is ready.
            </p>
          </section>
        ) : (
          <form id="submit-token-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="requester-name">Your name</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="requester-name"
                      placeholder="Your name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="project"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="requester-project">
                      Your project
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="requester-project"
                      placeholder="Project name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="request"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="request-message">Request</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="request-message"
                      placeholder="What would you like us to add to or change about the Ownership Token Index?"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="additionalInfo"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="additional-info">
                      Additional information
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="min-h-24 resize-none"
                        id="additional-info"
                        placeholder="Please explain why this would be helpful to you."
                        rows={4}
                      />
                    </InputGroup>
                    <FieldDescription className="tabular-nums">
                      {field.value.length}/500 characters
                    </FieldDescription>
                    <FieldDescription>
                      Please explain why this would be helpful to you.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="submitterEmail"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="submitter-email">
                      Your Email
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                      id="submitter-email"
                      placeholder="your.email@example.com"
                      type="email"
                    />
                    <FieldDescription>
                      We will reach out to you if we need any additional
                      information.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        )}

        <DialogFooter>
          {submitState.status !== "success" ? (
            <>
              <Button
                onClick={() => onOpenChange?.(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={submitState.status === "submitting"}
                form="submit-token-form"
                type="submit"
              >
                Submit request
              </Button>
            </>
          ) : null}
          {submitState.status === "error" ? (
            <p className="text-sm text-destructive">{submitState.message}</p>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
