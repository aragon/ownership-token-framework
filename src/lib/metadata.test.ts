import { describe, expect, it } from "vitest"
import { generateOpenGraphMetadata } from "./metadata"

const BASE = "https://otf.aragon.org"

function find(meta: ReturnType<typeof generateOpenGraphMetadata>, key: string) {
  return meta.find((m) => "property" in m && m.property === key) as
    | { content: string }
    | undefined
}

describe("generateOpenGraphMetadata", () => {
  it("emits sane defaults with an absolute image url", () => {
    const meta = generateOpenGraphMetadata()
    expect(meta[0]).toHaveProperty("title")
    expect(find(meta, "og:image")?.content).toBe(`${BASE}/og-images/index.png`)
    expect(find(meta, "og:url")?.content).toBe(BASE)
  })

  it("resolves a relative image path against the base url", () => {
    const meta = generateOpenGraphMetadata({
      image: "/og-images/tokens-uni.png",
    })
    expect(find(meta, "og:image")?.content).toBe(
      `${BASE}/og-images/tokens-uni.png`
    )
  })

  it("passes an absolute image url through unchanged", () => {
    const meta = generateOpenGraphMetadata({
      image: "https://cdn.example.com/x.png",
    })
    expect(find(meta, "og:image")?.content).toBe(
      "https://cdn.example.com/x.png"
    )
  })

  it("builds an absolute og:url from a relative path", () => {
    const meta = generateOpenGraphMetadata({ url: "/tokens/uni" })
    expect(find(meta, "og:url")?.content).toBe(`${BASE}/tokens/uni`)
  })
})
