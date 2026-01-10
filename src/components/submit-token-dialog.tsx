"use client"

import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"

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
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { zodResolver } from "@hookform/resolvers/zod"

const submitTokenSchema = z.object({
  tokenName: z
    .string()
    .min(2, "Token name must be at least 2 characters")
    .max(50, "Token name must be at most 50 characters"),
  tokenSymbol: z
    .string()
    .min(1, "Token symbol is required")
    .max(10, "Token symbol must be at most 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Token symbol must be uppercase letters and numbers only"
    ),
  contractAddress: z
    .string()
    .min(1, "Contract address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum contract address"),
  network: z.string().min(1, "Network is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be at most 500 characters"),
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
      tokenName: "",
      tokenSymbol: "",
      contractAddress: "",
      network: "ethereum",
      description: "",
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
    // TODO: Re-enable API submission once Notion + Slack credentials are ready.
    console.log("Form submitted:", data)
    setSubmitState({
      status: "success",
      message: "Submission received. We'll follow up soon.",
    })
    form.reset()
    return
    /*
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
    */
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Token for Analysis</DialogTitle>
          <DialogDescription>
            Submit a token to be evaluated using our ownership analytics
            framework. All submissions are reviewed before being added to the
            index.
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
                name="tokenName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="token-name">Token Name</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="token-name"
                      placeholder="e.g., Aave"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="tokenSymbol"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="token-symbol">Token Symbol</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="token-symbol"
                      placeholder="e.g., AAVE"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="contractAddress"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contract-address">
                      Contract Address
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="contract-address"
                      placeholder="0x..."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="network"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="network">Network</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      id="network"
                      placeholder="e.g., Ethereum, Polygon, Arbitrum"
                    />
                    <FieldDescription>
                      The blockchain network where this token is deployed
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="min-h-24 resize-none"
                        id="description"
                        placeholder="Provide a brief description of the token and why it should be analyzed..."
                        rows={4}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/500 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
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
                      We'll notify you when the token analysis is complete
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
                Submit for Review
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
