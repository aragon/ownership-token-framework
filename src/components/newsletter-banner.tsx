import { useState } from "react"
import { NewsletterSignupDialog } from "@/components/newsletter-signup-dialog"
import { Button } from "@/components/ui/button"

export const NewsletterBanner: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <aside
        aria-label="Newsletter subscription banner"
        className="bg-foreground flex items-start justify-center"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 items-center w-full p-4 lg:justify-center lg:px-12 lg:py-4">
          <div className="flex flex-col justify-center font-medium text-primary-foreground text-center lg:text-left lg:whitespace-nowrap">
            <p className="text-base leading-6 tracking-normal">
              <span className="font-bold">AAVE</span>
              {", "}
              <span className="font-bold">UNI</span>
              {", "}
              <span className="font-bold">CRV</span>
              {", "}
              <span className="font-bold">LDO</span>
              {", "}
              <span className="font-bold">AERO</span>
              {
                " are now live on the dashboard. Be first to know when new tokens are listed."
              }
            </p>
          </div>
          <Button
            className="bg-background text-foreground border border-border rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] hover:bg-background/90 h-9 px-4 py-2 shrink-0"
            onClick={() => setIsDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <span className="text-sm font-medium leading-5">Notify me</span>
          </Button>
        </div>
      </aside>

      <NewsletterSignupDialog
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
      />
    </>
  )
}
