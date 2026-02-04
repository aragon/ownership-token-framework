"use client"

import { XIcon } from "lucide-react"
import { useState } from "react"
import { NewsletterSignupDialog } from "@/components/newsletter-signup-dialog"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export const NewsletterBanner: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  if (!isBannerVisible) return null

  return (
    <>
      <aside
        aria-label="Newsletter subscription banner"
        className="bg-accent border-b border-accent-foreground/10"
      >
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 sm:px-6">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <p className="text-sm font-medium text-accent-foreground flex-1">
                📬 Stay updated with new token reports and framework updates
              </p>
              <Button
                aria-label="Dismiss banner"
                className="shrink-0 h-8 w-8 p-0 sm:hidden"
                onClick={() => setIsBannerVisible(false)}
                size="sm"
                variant="ghost"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                variant="outline"
              >
                Subscribe
              </Button>
              <Button
                aria-label="Dismiss banner"
                className="shrink-0 h-8 w-8 p-0 hidden sm:inline-flex"
                onClick={() => setIsBannerVisible(false)}
                size="sm"
                variant="ghost"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </aside>

      <NewsletterSignupDialog
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
      />
    </>
  )
}
