import {
  IconBrandTwitter,
  IconCheck,
  IconCopy,
  IconLink,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { copyToClipboard, truncateAddress } from "@/lib/utils"
import type { TokenInfo } from "./token-detail"
import { Button } from "./ui/button"
import { ExplorerIcon } from "./ui/explore-icon.tsx"

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
    <aside className="rounded-lg border bg-card p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold leading-7 tracking-normal">
          Info
        </h3>
        <p className="text-base leading-6 tracking-normal text-muted-foreground">
          {token.infoDescription}
        </p>
      </div>

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
