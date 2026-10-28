import { getRequestHeaders } from "@tanstack/react-start/server"
import { checkBotId } from "botid/server"

// Rejects requests BotID classifies as bots. Only call from POST server fns:
// the client attaches BotID headers to those only (see src/client.tsx).
// Always passes in local dev (BotID reports human outside Vercel).
export async function assertHuman() {
  const { isBot } = await checkBotId({
    advancedOptions: { headers: Object.fromEntries(getRequestHeaders()) },
  })
  if (isBot) throw new Error("Access denied")
}
