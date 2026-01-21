import { createServerFn } from "@tanstack/react-start"

type NewsletterSignupData = {
  email: string
}

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
  .inputValidator((data: NewsletterSignupData) => data)
  .handler(async ({ data }): Promise<NewsletterSignupResult> => {
    const email = data.email?.trim()

    if (!email) {
      throw new Error("Email is required")
    }

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
          }),
        }
      )

      if (response.ok) {
        return { ok: true }
      }

      // Handle error responses
      const errorPayload: EmailOctopusV16ErrorResponse = await response
        .json()
        .catch(() => ({}))

      // Handle duplicate subscription (409 Conflict)
      if (response.status === 409 || isAlreadySubscribed(errorPayload)) {
        return { ok: true, alreadySubscribed: true }
      }

      // Handle validation errors (400 Bad Request with INVALID_PARAMETERS)
      if (
        response.status === 400 &&
        errorPayload.error?.code === "INVALID_PARAMETERS"
      ) {
        throw new Error(errorPayload.error.message || "Invalid email address.")
      }

      // Handle authentication errors (401 Unauthorized)
      if (
        response.status === 401 ||
        errorPayload.error?.code === "INVALID_API_KEY"
      ) {
        throw new Error("Service configuration error")
      }

      // Handle rate limiting (429 Too Many Requests)
      if (response.status === 429) {
        throw new Error(
          "Service temporarily unavailable. Please try again in a moment."
        )
      }

      // Generic error fallback with API message if available
      throw new Error(
        errorPayload.error?.message ||
          "Unable to complete signup. Please try again later."
      )
    } catch (error) {
      // Re-throw known errors
      if (error instanceof Error) {
        throw error
      }
      // Handle network errors or unexpected failures
      throw new Error("Network error. Please check your connection.")
    }
  })
