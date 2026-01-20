import { createServerFn } from "@tanstack/react-start"

const NOTION_VERSION = "2022-06-28"

interface SubmissionData {
  name: string
  project: string
  request: string
  additionalInfo: string
  email: string
}

async function notifyFailure(error: string, submission: SubmissionData) {
  // Always log to console (captured by hosting provider)
  console.error("[OTI Submission Failed]", { error, submission })

  // Try Slack notification as secondary alert
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
    // Slack failed too - but we already logged to console
  }
}

export const submitTokenFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string
      project: string
      request: string
      additionalInfo: string
      submitterEmail: string
    }) => data
  )
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
  }
)
