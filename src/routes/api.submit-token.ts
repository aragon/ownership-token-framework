// TODO: Move this file to src/lib/server/ - these are server functions, not routes
import { createServerFn } from "@tanstack/react-start"
import * as z from "zod"

const NOTION_VERSION = "2022-06-28"

// Shared by the form and the server fn: the server must not trust the client.
export const submitTokenSchema = z.object({
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

interface SubmissionData {
  name: string
  project: string
  request: string
  additionalInfo: string
  email: string
}

async function notifyFailure(error: string, submission: SubmissionData) {
  // Console log is the primary alert (captured by the hosting provider); Slack
  // is a best-effort secondary.
  console.error("[OTI Submission Failed]", { error, submission })

  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: ":warning: *OTI Submission Failed*",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:warning: *OTI Submission Failed*\n\n${error}`,
            },
          },
          { type: "divider" },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "*This was the form payload at failure:*",
              },
            ],
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Name:*\n${submission.name}` },
              { type: "mrkdwn", text: `*Email:*\n${submission.email}` },
              { type: "mrkdwn", text: `*Project:*\n${submission.project}` },
              { type: "mrkdwn", text: `*Request:*\n${submission.request}` },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Additional Info:*\n${submission.additionalInfo}`,
            },
          },
        ],
      }),
    })
  } catch {
    // Slack failed too — already logged to console above.
  }
}

export const submitTokenFn = createServerFn({ method: "POST" })
  .inputValidator(submitTokenSchema)
  .handler(async ({ data }) => {
    const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

    if (!NOTION_API_TOKEN || !NOTION_DATABASE_ID) {
      await notifyFailure("Server not configured", {
        name: data.name,
        project: data.project,
        request: data.request,
        additionalInfo: data.additionalInfo,
        email: data.submitterEmail,
      })
      throw new Error("Server not configured")
    }

    const notionResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          "Project name": {
            title: [{ text: { content: data.project } }],
          },
          "Your name": {
            rich_text: [{ text: { content: data.name } }],
          },
          Request: {
            rich_text: [{ text: { content: data.request } }],
          },
          "Additional information": {
            rich_text: [{ text: { content: data.additionalInfo } }],
          },
          "Your email": {
            email: data.submitterEmail,
          },
          Status: {
            select: { name: "New" },
          },
        },
      }),
    })

    if (!notionResponse.ok) {
      const errorPayload = await notionResponse.json().catch(() => ({}))
      const errorMessage = [
        `*Status:* ${notionResponse.status} ${notionResponse.statusText}`,
        `*Code:* ${errorPayload?.code || "unknown"}`,
        `*Message:* ${errorPayload?.message || "No message provided"}`,
      ].join("\n")
      await notifyFailure(errorMessage, {
        name: data.name,
        project: data.project,
        request: data.request,
        additionalInfo: data.additionalInfo,
        email: data.submitterEmail,
      })
      throw new Error("Failed to save submission. Try again later.")
    }

    return { ok: true }
  })
