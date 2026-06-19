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
  handleGetDiscovery,
  handleGetFaq,
  handleGetFramework,
  handleGetOpenApi,
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

const snapshotId = readJson(join(generated, "manifest.json"))
  .snapshot_id as string
const currentEtag = `"${snapshotId}"`

describe("ETag / conditional GET", () => {
  it("stamps a snapshot-derived ETag on every 200 envelope response", async () => {
    for (const res of [
      await handleGetTokens(),
      await handleGetFramework(),
      await handleGetFaq(),
      await handleGetToken("ldo"),
    ]) {
      expect(res.status).toBe(200)
      expect(res.headers.get("ETag")).toBe(currentEtag)
    }
  })

  it("returns 304 with no body when If-None-Match matches the ETag", async () => {
    const req = new Request("https://x/api/v1/tokens", {
      headers: { "If-None-Match": currentEtag },
    })
    const res = await handleGetTokens(req)
    expect(res.status).toBe(304)
    expect(res.headers.get("ETag")).toBe(currentEtag)
    expect(await res.text()).toBe("")
  })

  it("honors the comma-separated and weak forms of If-None-Match", async () => {
    const req = new Request("https://x/api/v1/framework", {
      headers: { "If-None-Match": `"stale-x", W/${currentEtag}` },
    })
    expect((await handleGetFramework(req)).status).toBe(304)
  })

  it("honors the * wildcard", async () => {
    const req = new Request("https://x/api/v1/faq", {
      headers: { "If-None-Match": "*" },
    })
    expect((await handleGetFaq(req)).status).toBe(304)
  })

  it("serves the full 200 body when If-None-Match does not match", async () => {
    const req = new Request("https://x/api/v1/tokens", {
      headers: { "If-None-Match": '"some-other-snapshot"' },
    })
    const res = await handleGetTokens(req)
    expect(res.status).toBe(200)
    const payload = await body(res)
    expect(() => indexSchema.parse(payload.data)).not.toThrow()
  })

  it("conditional GET works on the per-token endpoint too", async () => {
    const req = new Request("https://x/api/v1/tokens/ldo", {
      headers: { "If-None-Match": currentEtag },
    })
    const res = await handleGetToken("ldo", req)
    expect(res.status).toBe(304)
    expect(await res.text()).toBe("")
  })
})

describe("GET /api/v1/openapi.json", () => {
  it("is a valid-shaped OpenAPI 3.1 document with the four endpoints", async () => {
    const res = await handleGetOpenApi()
    expect(res.status).toBe(200)
    expect(res.headers.get("Content-Type")).toBe("application/json")
    expect(res.headers.get("ETag")).toBe(currentEtag)

    const doc = await body(res)
    expect(doc.openapi).toBe("3.1.0")
    expect(doc.info.version).toBe("v1")
    for (const path of ["/tokens", "/tokens/{id}", "/framework", "/faq"]) {
      expect(doc.paths[path]?.get, path).toBeTruthy()
    }
  })

  it("emits component schemas generated from the Zod read-models", async () => {
    const doc = await body(await handleGetOpenApi())
    for (const id of [
      "TokenIndex",
      "TokenDoc",
      "FrameworkDoc",
      "Faq",
      "Provenance",
      "ApiError",
    ]) {
      expect(doc.components.schemas[id], id).toBeTruthy()
    }
    // Generated, not hand-duplicated: the dialect keys zod stamps are stripped.
    expect(doc.components.schemas.Provenance.$schema).toBeUndefined()
    // The provenance source enum is carried through from the Zod schema.
    expect(doc.components.schemas.Provenance.properties.source.enum).toEqual([
      "generated",
      "release",
    ])
  })

  it("every $ref resolves to a declared component schema", async () => {
    const doc = await body(await handleGetOpenApi())
    const declared = new Set(Object.keys(doc.components.schemas))
    const refs: string[] = []
    const walk = (node: unknown) => {
      if (Array.isArray(node)) {
        for (const n of node) {
          walk(n)
        }
      } else if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) {
          if (k === "$ref" && typeof v === "string") {
            refs.push(v)
          } else {
            walk(v)
          }
        }
      }
    }
    walk(doc)
    expect(refs.length).toBeGreaterThan(0)
    for (const r of refs) {
      const name = r.replace("#/components/schemas/", "")
      expect(declared.has(name), r).toBe(true)
    }
  })

  it("returns 304 when If-None-Match matches", async () => {
    const req = new Request("https://x/api/v1/openapi.json", {
      headers: { "If-None-Match": currentEtag },
    })
    const res = await handleGetOpenApi(req)
    expect(res.status).toBe(304)
    expect(await res.text()).toBe("")
  })
})

describe("GET /api/v1 discovery root", () => {
  it("points at the schema and guides and carries provenance", async () => {
    const res = await handleGetDiscovery()
    expect(res.status).toBe(200)
    expect(res.headers.get("ETag")).toBe(currentEtag)

    const doc = await body(res)
    expect(doc.version).toBe("v1")
    expect(doc.schema).toBe("/api/v1/openapi.json")
    expect(doc.guides).toEqual(["/llms.txt", "/agent-guide.md"])
    expect(doc.endpoints).toContain("/api/v1/tokens")
    expect(() => provenanceSchema.parse(doc.provenance)).not.toThrow()
  })

  it("returns 304 when If-None-Match matches", async () => {
    const req = new Request("https://x/api/v1/index.json", {
      headers: { "If-None-Match": currentEtag },
    })
    const res = await handleGetDiscovery(req)
    expect(res.status).toBe(304)
    expect(await res.text()).toBe("")
  })
})
