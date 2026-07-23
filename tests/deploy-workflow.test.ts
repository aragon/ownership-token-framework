import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const workflow = readFileSync(".github/workflows/deploy.yml", "utf8")

describe("deploy workflow content source", () => {
  it("defaults production deploys to otf-cms main when no content ref is provided", () => {
    const resolveStep = workflow.indexOf("Resolve content ref")
    const buildStep = workflow.indexOf("Build")

    expect(resolveStep).toBeGreaterThan(-1)
    expect(resolveStep).toBeLessThan(buildStep)
    expect(workflow).toContain("content_ref=main")
    expect(workflow).toContain('echo "ref=$content_ref" >> "$GITHUB_OUTPUT"')
    expect(workflow).toContain("OTF_CONTENT_REF: $" + "{{ steps.content.outputs.ref }}")
  })

  it("documents build-time CMS content instead of runtime release reads", () => {
    expect(workflow).toContain("Production content is compiled at build time from otf-cms")
    expect(workflow).not.toContain("Production content arrives at runtime from the published Release")
    expect(workflow).not.toContain("committed/runtime data")
  })
})
