import {
  IconBrandTwitter,
  IconCheck,
  IconCopy,
  IconLink,
  // @ts-expect-error by default it imports from cjs build and triggers server-side error
} from "@tabler/icons-react/dist/esm/tabler-icons-react.mjs"
import { useEffect, useState } from "react"
import { copyToClipboard, truncateAddress } from "@/lib/utils"
import type { TokenInfo } from "./token-detail"
import { Button } from "./ui/button"
import { ExplorerIcon } from "./ui/explore-icon.tsx"

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 6 : 2,
  })
}

function formatSupply(value: number, symbol: string): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B ${symbol}`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M ${symbol}`
  }
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${symbol}`
}

export default function InfoSidebar({ token }: { token: TokenInfo }) {
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  }, [hasCopied])

  return (
    <aside className="rounded-lg border bg-card p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold leading-7 tracking-normal">
          Info
        </h3>
        <p className="text-base leading-6 tracking-normal text-muted-foreground">
          {token.infoDescription}
        </p>
      </div>

      {(token.marketCap != null ||
        token.totalSupply != null ||
        token.price != null) && (
        <dl className="grid grid-cols-1 divide-y text-sm">
          {token.marketCap != null && (
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Market cap</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrency(token.marketCap)}
              </dd>
            </div>
          )}
          {token.totalSupply != null && (
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Total supply</dt>
              <dd className="font-medium tabular-nums">
                {formatSupply(token.totalSupply, token.symbol)}
              </dd>
            </div>
          )}
          {token.price != null && (
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Token price</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrency(token.price)}
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-2">
        <Button
          className="gap-1.5 cursor-pointer"
          onClick={() => {
            copyToClipboard(token.address)
            setHasCopied(true)
          }}
          size="sm"
          variant="outline"
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? (
            <IconCheck className="size-4" />
          ) : (
            <IconCopy className="size-4" />
          )}
          {truncateAddress(token.address)}
        </Button>
        {token.links.scan && (
          <Button
            className="gap-1.5"
            nativeButton={false}
            render={
              <a
                href={token.links.scan}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExplorerIcon />
                Explorer
              </a>
            }
            size="sm"
            variant="outline"
          />
        )}
        {token.links.website && (
          <Button
            className="gap-1.5"
            nativeButton={false}
            render={
              <a
                aria-label="Visit website"
                href={token.links.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconLink className="size-4" />
                Website
              </a>
            }
            size="sm"
            variant="outline"
          />
        )}
        {token.links.twitter && (
          <Button
            className="gap-1.5"
            render={
              <a
                aria-label="Visit Twitter profile"
                href={token.links.twitter}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandTwitter className="size-4" />
                Twitter
              </a>
            }
            size="sm"
            variant="outline"
          />
        )}
      </div>
    </aside>
  )
}
