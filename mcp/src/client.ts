/**
 * Thin HTTP client for the Ownership Token Framework (OTF) public read API.
 *
 * All responses share the envelope `{ data, provenance }`. We keep the typing
 * deliberately loose (the API is the source of truth; the framework/rubric can
 * grow new metrics and criteria) and only model the fields this server reasons
 * about. Everything else is passed through untouched to the agent.
 */

// OTF_API_BASE is REQUIRED — there is no canonical public OTF API origin yet,
// and silently defaulting to a guess risks pointing at a stale deployment. The
// operator sets it to the OTF API origin: http://localhost:3000 for a local dev
// server, or the production domain once one is published.
export function getApiBase(): string {
  const raw = process.env.OTF_API_BASE?.trim();
  if (!raw) {
    throw new Error(
      "OTF_API_BASE is required — set it to your OTF API origin " +
        "(e.g. http://localhost:3000 for a local dev server, or the OTF " +
        "production domain).",
    );
  }
  // SSRF guard: OTF_API_BASE is the one trust anchor — it must be a real
  // http(s) origin (set by the operator, never derived from agent/tool input).
  // Validate it so a typo or hostile value can't redirect requests elsewhere.
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`OTF_API_BASE is not a valid URL: ${JSON.stringify(raw)}`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      `OTF_API_BASE must use http(s); got ${JSON.stringify(parsed.protocol)}`,
    );
  }
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(parsed.hostname);
  if (parsed.protocol === "http:" && !isLocal) {
    process.stderr.write(
      `otf-mcp-server: warning — OTF_API_BASE uses plain http (${parsed.hostname}); use https in production.\n`,
    );
  }
  // Strip a trailing slash so we can join paths predictably.
  return raw.replace(/\/+$/, "");
}

/** Provenance block attached to every API response. */
export interface Provenance {
  snapshot_id?: string;
  commit_ref?: string;
  last_updated?: string | null;
  published_at?: string | null;
  source?: string;
  [key: string]: unknown;
}

export interface Envelope<T> {
  data: T;
  provenance: Provenance;
}

/** Slim row from the token index (`/api/v1/tokens`). */
export interface TokenIndexRow {
  id: string;
  name: string;
  symbol: string;
  network?: string;
  score?: { passing: number; total: number; percentage: number };
  positive?: number;
  neutral?: number;
  atRisk?: number;
  evidenceEntries?: number;
  criteriaStatuses?: Record<string, string>;
  [key: string]: unknown;
}

export interface TokenIndex {
  tokens: TokenIndexRow[];
  [key: string]: unknown;
}

/**
 * Error carrying an HTTP status so callers can map e.g. 404 to a clean,
 * user-facing tool error instead of an unhandled throw.
 */
export class OtfApiError extends Error {
  readonly status?: number;
  readonly url: string;

  constructor(message: string, url: string, status?: number) {
    super(message);
    this.name = "OtfApiError";
    this.url = url;
    this.status = status;
  }
}

const REQUEST_TIMEOUT_MS = 15_000;
/** Reject oversized responses (memory / agent-context flooding guard). */
const MAX_RESPONSE_BYTES = 5_000_000;

async function fetchJson<T>(path: string): Promise<Envelope<T>> {
  const url = `${getApiBase()}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? `request timed out after ${REQUEST_TIMEOUT_MS}ms`
        : err instanceof Error
          ? err.message
          : String(err);
    throw new OtfApiError(`Failed to reach OTF API: ${reason}`, url);
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new OtfApiError(
      `OTF API responded with HTTP ${res.status} ${res.statusText}`,
      url,
      res.status,
    );
  }

  // Size guard: reject a declared-oversized body before reading it into memory
  // (a compromised/misconfigured upstream shouldn't be able to flood us or the
  // agent's context). The request timeout bounds undeclared/chunked bodies.
  const declaredLen = Number(res.headers.get("content-length"));
  if (Number.isFinite(declaredLen) && declaredLen > MAX_RESPONSE_BYTES) {
    throw new OtfApiError(
      `OTF API response too large (${declaredLen} bytes > ${MAX_RESPONSE_BYTES})`,
      url,
      res.status,
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new OtfApiError(
      "OTF API returned a response that was not valid JSON",
      url,
      res.status,
    );
  }

  const envelope = json as Partial<Envelope<T>>;
  if (envelope == null || typeof envelope !== "object" || !("data" in envelope)) {
    throw new OtfApiError(
      "OTF API response did not match the expected { data, provenance } shape",
      url,
      res.status,
    );
  }

  return {
    data: envelope.data as T,
    provenance: (envelope.provenance ?? {}) as Provenance,
  };
}

export function getTokenIndex(): Promise<Envelope<TokenIndex>> {
  return fetchJson<TokenIndex>("/api/v1/tokens");
}

export function getTokenById(id: string): Promise<Envelope<Record<string, unknown>>> {
  const encoded = encodeURIComponent(id.toLowerCase());
  return fetchJson<Record<string, unknown>>(`/api/v1/tokens/${encoded}`);
}

export function getFramework(): Promise<Envelope<unknown>> {
  return fetchJson<unknown>("/api/v1/framework");
}

export function getFaq(): Promise<Envelope<unknown>> {
  return fetchJson<unknown>("/api/v1/faq");
}
