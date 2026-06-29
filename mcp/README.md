# OTF MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes
the **Ownership Token Framework (OTF)** public read API as agent tools. Point
Claude Desktop, Claude Code, Cursor, or Codex at it and query the framework data —
which crypto protocols are genuinely tokenholder-owned, on evidence, against a
fixed rubric — directly from your assistant.

It is a thin, read-only wrapper over the OTF JSON API (`/api/v1/*`, no auth).
Every tool result includes a provenance citation line carrying
`provenance.snapshot_id` and `commit_ref` so answers are reproducible.

## Tools

| Tool | Input | Returns |
|---|---|---|
| `list_tokens` | `network?`, `minScorePercentage?`, `criterion?`, `status?` | Slim index rows. Filters are applied client-side over `/api/v1/tokens`. `criterion`+`status` keeps tokens whose `criteriaStatuses[criterion] === status`. |
| `get_token` | `id` (lowercase, e.g. `ldo`) | The full token report: `metrics[].criteria[]` with `status`, `notes`, `evidence[]`, plus `score` and counts. |
| `get_framework` | — | The rubric: metric/criterion `name` + `about` definitions. |
| `search_tokens` | `query` | Case-insensitive match over token `name`/`symbol`/`id` from the index. |
| `get_faq` | — | Methodology / framework Q&A. |

`status` is one of the OTF status vocabulary: `positive`, `warning`, `at_risk`,
`unevaluated`, `reference`.

A request for a token id that does not exist returns a clean tool error
(`isError: true`), not a thrown exception.

## Configuration

| Env var | Required | Notes |
|---|---|---|
| `OTF_API_BASE` | **yes** | Base URL of the OTF API. There is no default — the server errors at startup if it is unset, so it can never silently query the wrong origin. Set it to the OTF API origin. |

For a local app dev server this is typically `http://localhost:3000`. Once a
canonical OTF production domain exists, use that.

## Run locally

Requires Node.js >= 20.

```bash
cd mcp
npm install        # standalone; creates its own package-lock.json
npm run build      # compiles src/ -> dist/
npm start          # runs dist/index.js over stdio (or: node dist/index.js)
```

Type-check only: `npm run typecheck`.

The server speaks MCP over **stdio**; it is meant to be launched by an MCP
client, not used interactively. stdout is reserved for the protocol — all logs
go to stderr.

## Global install (optional)

To drop the absolute path from every client config, install the built package
globally so the `otf-mcp-server` executable lands on your `PATH`:

```bash
cd mcp
npm run build      # produces dist/
npm install -g .   # puts `otf-mcp-server` on PATH (from the `bin` field)
```

Now any client can launch it by name — `otf-mcp-server` with no `node` and no
path. The per-client snippets below show both forms. To upgrade after pulling
new code, rebuild and re-run `npm install -g .`; remove it with
`npm uninstall -g otf-mcp-server`.

## Client configuration

After a **global install** (above), use the bare command `otf-mcp-server`.
Otherwise, after `npm run build`, use the **absolute path** to `dist/index.js`.

### Claude

Global install:

```bash
claude mcp add otf --env OTF_API_BASE=http://localhost:3000 -- otf-mcp-server
```

Local path:

```bash
claude mcp add otf --env OTF_API_BASE=http://localhost:3000 -- node /ABSOLUTE/PATH/TO/ownership-token-framework/mcp/dist/index.js
```

### Cursor

Edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project). With a global
install, set `"command": "otf-mcp-server"` and drop `args`:

```json
{
  "mcpServers": {
    "otf": {
      "command": "otf-mcp-server",
      "env": {
        "OTF_API_BASE": "http://localhost:3000"
      }
    }
  }
}
```

Without a global install, point at the built file:

```json
{
  "mcpServers": {
    "otf": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/ownership-token-framework/mcp/dist/index.js"],
      "env": {
        "OTF_API_BASE": "http://localhost:3000"
      }
    }
  }
}
```

### Codex CLI

Add to `~/.codex/config.toml`. With a global install, use the bare command:

```toml
[mcp_servers.otf]
command = "otf-mcp-server"
env = { OTF_API_BASE = "http://localhost:3000" }
```

Without a global install, point at the built file:

```toml
[mcp_servers.otf]
command = "node"
args = ["/ABSOLUTE/PATH/TO/ownership-token-framework/mcp/dist/index.js"]
env = { OTF_API_BASE = "http://localhost:3000" }
```

### Via npx (after publishing)

Once this package is published to npm, clients can run it without a local
checkout by replacing the `command`/`args` with:

```json
{ "command": "npx", "args": ["-y", "otf-mcp-server"] }
```

## Security & threat model

A read-only MCP over a public API still has a real attack surface; the hardening
here is deliberate.

- **Bounded blast radius.** Read-only — no tool writes, deletes, or mutates
  anything, and the server holds no credentials or auth tokens (the OTF API is
  public). The worst case through it is reading already-public data.
- **Indirect prompt injection.** OTF content (criterion notes, evidence, FAQ,
  and any future third-party submissions) is relayed verbatim into the agent's
  context. Every tool result is prefixed with an explicit *untrusted-content
  boundary* telling the model the payload is DATA, not instructions — so
  imperative text inside a token's notes is reported, not executed. Evidence
  URLs are labelled third-party and are not auto-fetched.
- **Input / request safety.** Tool inputs are zod-validated; the token `id` is
  constrained to `[a-z0-9-]` and URL-encoded before it reaches a path (no
  traversal / injection). Requests are GET-only, time-bounded (15s), and reject
  oversized responses (5 MB cap).
- **SSRF.** `OTF_API_BASE` is the one trust anchor — operator-set, never derived
  from agent/tool input — and is validated to be a real http(s) origin. Keep it
  pointed at the canonical OTF API.
- **Supply chain.** Dependencies (`@modelcontextprotocol/sdk`, `zod`) are
  exact-pinned (no `^`/`latest`) to versions published 7+ days earlier, installed
  from the committed `package-lock.json` (`npm ci`), with lifecycle scripts
  disabled (`.npmrc` `ignore-scripts=true`). Minimal dependency surface; run
  `npm audit` before publishing.

## Notes

- **Standalone package.** This directory has its own `package.json` and
  `package-lock.json` and is installed with `npm` independently of the parent
  app's pnpm workspace. The root `pnpm-workspace.yaml` declares no `packages`,
  so `mcp/` is not part of the pnpm workspace and the app build is unaffected.
- **No production domain yet.** There is no canonical public OTF API origin, so
  `OTF_API_BASE` is required (no default) and the server refuses to start without
  it. Point it at a local dev server (`http://localhost:3000`) or the production
  domain once one is published.
