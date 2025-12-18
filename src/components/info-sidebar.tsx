import { IconCheck, IconCopy } from "@tabler/icons-react"
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
            render={
              <a
                href={token.links.scan}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  className="size-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Explorer</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
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
                <ExternalLinkIcon className="size-3.5" />
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
                <svg
                  className="size-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Twitter</title>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
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
