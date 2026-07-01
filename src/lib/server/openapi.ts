/**
 * OpenAPI 3.1 contract for the public read API, built FROM the vendored Zod
 * read-models (via `z.toJSONSchema`, zod v4) so component schemas can't drift
 * from the served shapes. Only the no-Zod-source surface is handcrafted: paths,
 * the `{data, provenance}` envelope wiring, and response/status metadata.
 */
import { z } from "zod"
import {
  apiErrorSchema,
  faqSchema,
  frameworkDocSchema,
  indexSchema,
  provenanceSchema,
  tokenDocSchema,
} from "@/lib/schemas"

/** OpenAPI `components.schemas` ids. Kept stable — codegen consumers $ref these. */
const SCHEMA_IDS = {
  index: "TokenIndex",
  tokenDoc: "TokenDoc",
  framework: "FrameworkDoc",
  faq: "Faq",
  provenance: "Provenance",
  apiError: "ApiError",
} as const

/** `#/components/schemas/<id>` ref to a named component. */
function ref(id: string): { $ref: string } {
  return { $ref: `#/components/schemas/${id}` }
}

/**
 * Emit `components.schemas` from the Zod read-models. Registering each schema
 * with an id makes zod cross-link reused subschemas via `#/components/schemas/<id>`
 * $refs (unregistered subschemas are inlined). The per-schema `$schema`/`$id`
 * keys zod stamps must be stripped — OpenAPI 3.1 rejects them on components.
 */
function buildComponentSchemas(): Record<string, unknown> {
  const registry = z.registry<{ id: string }>()
  registry.add(indexSchema, { id: SCHEMA_IDS.index })
  registry.add(tokenDocSchema, { id: SCHEMA_IDS.tokenDoc })
  registry.add(frameworkDocSchema, { id: SCHEMA_IDS.framework })
  registry.add(faqSchema, { id: SCHEMA_IDS.faq })
  registry.add(provenanceSchema, { id: SCHEMA_IDS.provenance })
  registry.add(apiErrorSchema, { id: SCHEMA_IDS.apiError })

  const { schemas } = z.toJSONSchema(registry, {
    uri: (id) => `#/components/schemas/${id}`,
    // OpenAPI 3.1 aligns with JSON Schema 2020-12; keep refs as plain pointers.
    target: "draft-2020-12",
  })

  const cleaned: Record<string, unknown> = {}
  for (const [id, schema] of Object.entries(schemas)) {
    const { $schema, $id, ...rest } = schema as Record<string, unknown>
    cleaned[id] = rest
  }
  return cleaned
}

/** The `{ data, provenance }` success envelope wrapping a named data schema. */
function envelope(dataRef: { $ref: string }): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      data: dataRef,
      provenance: ref(SCHEMA_IDS.provenance),
    },
    required: ["data", "provenance"],
    additionalProperties: false,
  }
}

/** A 200 response serving the envelope around `dataRef`. */
function okEnvelope(description: string, dataRef: { $ref: string }) {
  return {
    "200": {
      description,
      content: { "application/json": { schema: envelope(dataRef) } },
    },
  }
}

/** The shared `{ error: { code, message } }` response for a status code. */
function errorResponse(description: string) {
  return {
    description,
    content: {
      "application/json": { schema: ref(SCHEMA_IDS.apiError) },
    },
  }
}

const NOT_MODIFIED = {
  "304": {
    description:
      "Not Modified — the client's `If-None-Match` matched the current `ETag`. No body.",
  },
} as const

/**
 * Build the OpenAPI 3.1 document for the four public GET endpoints plus the
 * discovery root. Pure and deterministic for a given build of the schemas.
 */
export function buildOpenApiDocument(): Record<string, unknown> {
  return {
    openapi: "3.1.0",
    info: {
      title: "Ownership Token Framework API",
      version: "v1",
      description:
        "Structured, evidence-backed analysis of how tokenholder-owned crypto " +
        "protocols are. Read-only JSON, no auth. Every response is " +
        "`{ data, provenance }`; errors are `{ error: { code, message } }`.",
    },
    servers: [{ url: "/api/v1" }],
    paths: {
      "/": {
        get: {
          operationId: "getDiscoveryRoot",
          summary:
            "API discovery root: version, endpoints, schema, and guides.",
          responses: {
            "200": {
              description: "Discovery document.",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/tokens": {
        get: {
          operationId: "getTokens",
          summary: "Index of all analyzed tokens.",
          responses: {
            ...okEnvelope(
              "Token index wrapped in a provenance envelope.",
              ref(SCHEMA_IDS.index)
            ),
            ...NOT_MODIFIED,
          },
        },
      },
      "/tokens/{id}": {
        get: {
          operationId: "getToken",
          summary: "Full analysis for one token.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Lowercase token id, e.g. `ldo`.",
              schema: { type: "string" },
            },
          ],
          responses: {
            ...okEnvelope(
              "Composed token doc wrapped in a provenance envelope.",
              ref(SCHEMA_IDS.tokenDoc)
            ),
            ...NOT_MODIFIED,
            "404": errorResponse("No published token with that id."),
          },
        },
      },
      "/framework": {
        get: {
          operationId: "getFramework",
          summary:
            "The evaluation framework: metric and criterion definitions.",
          responses: {
            ...okEnvelope(
              "Framework doc wrapped in a provenance envelope.",
              ref(SCHEMA_IDS.framework)
            ),
            ...NOT_MODIFIED,
          },
        },
      },
      "/faq": {
        get: {
          operationId: "getFaq",
          summary: "Framework and methodology Q&A.",
          responses: {
            ...okEnvelope(
              "FAQ doc wrapped in a provenance envelope.",
              ref(SCHEMA_IDS.faq)
            ),
            ...NOT_MODIFIED,
          },
        },
      },
    },
    components: {
      schemas: buildComponentSchemas(),
    },
  }
}
