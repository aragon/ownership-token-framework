import {
  IconBrandTwitter,
  IconCheck,
  IconCopy,
  IconCurrencyEthereum,
  IconExternalLink,
  IconLink,
} from "@tabler/icons-react"
import { ExternalLinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { copyToClipboard } from "@/lib/utils"
import type { TokenInfo } from "./token-detail"
import { Button } from "./ui/button"

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
    <aside className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">Info</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {token.infoDescription}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
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
          {hasCopied ? <IconCheck /> : <IconCopy />}
          {token.address}
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
                <IconCurrencyEthereum />
                Explorer
              </a>
            }
            size="sm"
            variant="outline"
          />
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {token.links.website && (
          <Button
            className="gap-1.5"
            render={
              <a
                aria-label="Visit website"
                href={token.links.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconLink className="size-3.5" />
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
                <IconBrandTwitter />
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
