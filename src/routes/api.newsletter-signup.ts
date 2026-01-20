import { createServerFn } from "@tanstack/react-start"

type NewsletterSignupData = {
  email: string
}

type NewsletterSignupResult = {
  ok: true
  alreadySubscribed?: boolean
}

function isAlreadySubscribed(payload: unknown) {
  const errorCode =
    (payload as { error?: { code?: string } })?.error?.code ??
    (payload as { code?: string })?.code
  return (
    errorCode === "MEMBER_EXISTS" ||
    errorCode === "ALREADY_SUBSCRIBED" ||
    errorCode === "MEMBER_ALREADY_SUBSCRIBED"
  )
}

export const newsletterSignupFn = createServerFn({ method: "POST" }).handler(
  async (ctx): Promise<NewsletterSignupResult> => {
    const data = ctx.data as unknown as NewsletterSignupData
    const email = data.email?.trim()

    if (!email) {
      throw new Error("Email is required")
    }

    const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
    const listId = process.env.EMAIL_OCTOPUS_LIST_ID

    if (!apiKey || !listId) {
      throw new Error("Server not configured")
    }

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

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}))
      if (isAlreadySubscribed(errorPayload)) {
        return { ok: true, alreadySubscribed: true }
      }
      throw new Error("Failed to subscribe")
    }

    return { ok: true }
  }
)
