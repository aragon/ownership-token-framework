import { SignupInput } from "@/components/signup-input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface INewsletterSignupDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const NewsletterSignupDialog: React.FC<INewsletterSignupDialogProps> = (
  props
) => {
  const { open, onOpenChange } = props

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Newsletter</DialogTitle>
          <DialogDescription>
            Get an email when we publish a new token report or release major
            updates to the Framework.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <SignupInput messageAlignment="left" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
