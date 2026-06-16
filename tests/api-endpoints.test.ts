/**
 * Canonical token API handlers: envelope contract, payload parity with the
 * generated read models, and structured 404s.
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  apiErrorSchema,
  faqSchema,
  frameworkDocSchema,
  indexSchema,
  provenanceSchema,
  tokenDocSchema,
} from "@/lib/schemas"
import {
  handleGetFaq,
  handleGetFramework,
  handleGetToken,
  handleGetTokens,
} from "@/lib/server/token-api"

const generated = join(__dirname, "..", "src", "data", "generated")
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"))

const TOKEN_IDS = readJson(join(generated, "manifest.json")).tokens as string[]

async function body(res: Response) {
  return JSON.parse(await res.text())
}

describe("GET /api/tokens", () => {
  it("returns the published index wrapped in a provenance envelope", async () => {
    const res = await handleGetTokens()
    expect(res.status).toBe(200)
    expect(res.headers.get("Content-Type")).toBe("application/json")

    const payload = await body(res)
    expect(() => provenanceSchema.parse(payload.provenance)).not.toThrow()
    expect(() => indexSchema.parse(payload.data)).not.toThrow()
  })

  it("data payload is identical to generated/index.json", async () => {
    const payload = await body(await handleGetTokens())
    expect(payload.data).toEqual(readJson(join(generated, "index.json")))
  })

  it("envelope: commit_ref non-null, published_at null pre-pipeline, snapshot_id matches manifest", async () => {
    const { provenance } = await body(await handleGetTokens())
    expect(provenance.commit_ref).toBeTruthy()
    expect(provenance.published_at).toBeNull()
    expect(provenance.source).toBe("generated")
    expect(provenance.snapshot_id).toBe(
      readJson(join(generated, "manifest.json")).snapshot_id
    )
  })
})

describe("GET /api/framework", () => {
  it("returns the framework doc with provenance, identical to generated", async () => {
    const res = await handleGetFramework()
    expect(res.status).toBe(200)
    const payload = await body(res)
    expect(() => frameworkDocSchema.parse(payload.data)).not.toThrow()
    expect(() => provenanceSchema.parse(payload.provenance)).not.toThrow()
    expect(payload.data).toEqual(readJson(join(generated, "framework.json")))
  })
})

describe("GET /api/v1/faq", () => {
  it("returns the faq doc with provenance, identical to generated", async () => {
    const res = await handleGetFaq()
    expect(res.status).toBe(200)
    const payload = await body(res)
    expect(() => faqSchema.parse(payload.data)).not.toThrow()
    expect(() => provenanceSchema.parse(payload.provenance)).not.toThrow()
    expect(payload.data).toEqual(readJson(join(generated, "faq.json")))
  })
})

describe("GET /api/tokens/{id}", () => {
  it("returns every published token doc identical to its generated file", async () => {
    for (const id of TOKEN_IDS) {
      const res = await handleGetToken(id)
      expect(res.status, id).toBe(200)
      const payload = await body(res)
      expect(() => tokenDocSchema.parse(payload.data), id).not.toThrow()
      expect(payload.data, id).toEqual(
        readJson(join(generated, "tokens", `${id}.json`))
      )
      expect(() => provenanceSchema.parse(payload.provenance), id).not.toThrow()
    }
  })

  it("normalizes id casing and whitespace", async () => {
    const res = await handleGetToken("  LDO ")
    expect(res.status).toBe(200)
    const payload = await body(res)
    expect(payload.data.id).toBe("ldo")
  })

  it.each(["doge", "not-a-token"])(
    "returns structured 404 for unknown id %s",
    async (id) => {
      const res = await handleGetToken(id)
      expect(res.status).toBe(404)
      const payload = await body(res)
      expect(() => apiErrorSchema.parse(payload)).not.toThrow()
      expect(payload.error.code).toBe("TOKEN_NOT_FOUND")
    }
  )
})
