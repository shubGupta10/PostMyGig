import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { MessageSquare, Heart, Sparkles } from 'lucide-react'

interface FeedbackDialogProps {
  open: boolean
  onClose: () => void
}

export default function FeedbackDialog({ open, onClose }: FeedbackDialogProps) {
  const router = useRouter()

  const handleRedirect = () => {
    onClose()
    router.push('/user/feedback')
  }

  return (
    <>
      {/* Background blur overlay - only shows when dialog is open */}
      {open && (
        <div className="fixed inset-0 z-40 backdrop-blur-[2px] bg-black/20 animate-in fade-in-0 duration-200" />
      )}
      
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-background border border-border shadow-2xl rounded-2xl overflow-hidden z-50">
        <DialogHeader className="text-center space-y-3 pb-2">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            Help Us Improve <span className="text-primary">PostMyGig</span>
          </DialogTitle>
          
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Your feedback helps us build a better platform for everyone
          </p>
        </DialogHeader>

        {/* Visual separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-4" />

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border font-medium py-2 px-6 rounded-xl transition-all duration-200 cursor-pointer"
          >
            Maybe Later
          </Button>
          
          <Button 
            onClick={handleRedirect}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            Give Feedback
            <Sparkles className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}