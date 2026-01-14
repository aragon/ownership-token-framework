type SubmitTokenPayload = {
  name: string
  project: string
  request: string
  additionalInfo: string
  submitterEmail: string
}

type Env = {
  NOTION_API_TOKEN?: string
  NOTION_DATABASE_ID?: string
  SLACK_WEBHOOK_URL?: string
}

const NOTION_VERSION = "2022-06-28"

function getEnv(): Env {
  if (typeof process !== "undefined") {
    return process.env as Env
  }
  return {}
}

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

function getMissingFields(payload: SubmitTokenPayload) {
  const missing: string[] = []
  if (!payload.name) missing.push("name")
  if (!payload.project) missing.push("project")
  if (!payload.request) missing.push("request")
  if (!payload.additionalInfo) missing.push("additionalInfo")
  if (!payload.submitterEmail) missing.push("submitterEmail")
  return missing
}

export const config = {
  runtime: "edge",
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  const payload = (await request.json()) as SubmitTokenPayload
  const missingFields = getMissingFields(payload)
  if (missingFields.length > 0) {
    return jsonResponse(
      { error: `Missing fields: ${missingFields.join(", ")}` },
      400
    )
  }

  const { NOTION_API_TOKEN, NOTION_DATABASE_ID, SLACK_WEBHOOK_URL } = getEnv()

  if (!NOTION_API_TOKEN || !NOTION_DATABASE_ID) {
    return jsonResponse({ error: "Server not configured" }, 500)
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
          title: [{ text: { content: payload.project } }],
        },
        "Your name": {
          rich_text: [{ text: { content: payload.name } }],
        },
        Request: {
          rich_text: [{ text: { content: payload.request } }],
        },
        "Additional information": {
          rich_text: [{ text: { content: payload.additionalInfo } }],
        },
        "Your email": {
          email: payload.submitterEmail,
        },
        "Submitted at": {
          date: { start: new Date().toISOString() },
        },
        Status: {
          select: { name: "New" },
        },
      },
    }),
  })

  if (!notionResponse.ok) {
    const errorPayload = await notionResponse.json().catch(() => ({}))
    return jsonResponse(
      {
        error:
          errorPayload?.message ||
          "Failed to save submission. Try again later.",
      },
      502
    )
  }

  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `New token request: ${payload.project} from ${payload.name} (${payload.submitterEmail}). Request: ${payload.request}`,
      }),
    })
  }

  return jsonResponse({ ok: true })
}
