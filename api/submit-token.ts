type SubmitTokenPayload = {
  tokenName: string
  tokenSymbol: string
  contractAddress: string
  network: string
  description: string
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
  if (!payload.tokenName) missing.push("tokenName")
  if (!payload.tokenSymbol) missing.push("tokenSymbol")
  if (!payload.contractAddress) missing.push("contractAddress")
  if (!payload.network) missing.push("network")
  if (!payload.description) missing.push("description")
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
        "Token Name": {
          title: [{ text: { content: payload.tokenName } }],
        },
        Symbol: {
          rich_text: [{ text: { content: payload.tokenSymbol } }],
        },
        Network: {
          rich_text: [{ text: { content: payload.network } }],
        },
        Contract: {
          rich_text: [{ text: { content: payload.contractAddress } }],
        },
        Description: {
          rich_text: [{ text: { content: payload.description } }],
        },
        "Submitter Email": {
          email: payload.submitterEmail,
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
        text: `New token submission: ${payload.tokenName} (${payload.tokenSymbol}) on ${payload.network} from ${payload.submitterEmail}`,
      }),
    })
  }

  return jsonResponse({ ok: true })
}
