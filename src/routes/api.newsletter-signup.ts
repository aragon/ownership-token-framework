// TODO: Move this file to src/lib/server/ - these are server functions, not routes
import { createServerFn } from "@tanstack/react-start"
import * as z from "zod"
import { assertHuman } from "@/lib/bot-check"

// Shared by the form and the server fn: the server must not trust the client.
export const newsletterSignupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
})

type NewsletterSignupResult = {
  ok: true
  alreadySubscribed?: boolean
}

type EmailOctopusV16ErrorResponse = {
  error?: {
    code?: string
    message?: string
  }
}

function isAlreadySubscribed(payload: EmailOctopusV16ErrorResponse): boolean {
  const errorCode = payload.error?.code
  return (
    errorCode === "MEMBER_EXISTS" ||
    errorCode === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS" ||
    errorCode === "ALREADY_SUBSCRIBED" ||
    errorCode === "MEMBER_ALREADY_SUBSCRIBED"
  )
}

export const newsletterSignupFn = createServerFn({ method: "POST" })
  .inputValidator(newsletterSignupSchema)
  .handler(async ({ data: { email } }): Promise<NewsletterSignupResult> => {
    await assertHuman()

    const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
    const listId = process.env.EMAIL_OCTOPUS_LIST_ID

    if (!apiKey || !listId) {
      throw new Error("Server not configured")
    }

    try {
      const response = await fetch(
        `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: apiKey,
            email_address: email,
            status: "SUBSCRIBED",
            tags: ["ownership-token"],
          }),
        }
      )

      if (response.ok) {
        return { ok: true }
      }

      const errorPayload: EmailOctopusV16ErrorResponse = await response
        .json()
        .catch(() => ({}))

      // Already-subscribed is a success for our purposes.
      if (response.status === 409 || isAlreadySubscribed(errorPayload)) {
        return { ok: true, alreadySubscribed: true }
      }

      if (
        response.status === 400 &&
        errorPayload.error?.code === "INVALID_PARAMETERS"
      ) {
        throw new Error(errorPayload.error.message || "Invalid email address.")
      }

      if (
        response.status === 401 ||
        errorPayload.error?.code === "INVALID_API_KEY"
      ) {
        throw new Error("Service configuration error")
      }

      if (response.status === 429) {
        throw new Error(
          "Service temporarily unavailable. Please try again in a moment."
        )
      }

      throw new Error(
        errorPayload.error?.message ||
          "Unable to complete signup. Please try again later."
      )
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Network error. Please check your connection.")
    }
  })
