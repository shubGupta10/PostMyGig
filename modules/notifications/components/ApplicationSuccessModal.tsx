import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { CheckCircle, Briefcase, FileText, MessageSquare } from 'lucide-react'

interface ApplicationSuccessModalProps {
  open: boolean
  onClose: () => void
}

export function ApplicationSuccessModal({ open, onClose }: ApplicationSuccessModalProps) {
  const router = useRouter()

  const handleGoToProposals = () => {
    onClose()
    router.push('/user/proposals')
  }

  const handleBrowseMore = () => {
    onClose()
    router.push('/view-gigs')
  }

  const handleGiveFeedback = () => {
    onClose()
    router.push('/user/feedback')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-border shadow-sm rounded-2xl overflow-hidden z-50">
        <DialogHeader className="text-center space-y-3 pb-2 pt-4">
          {/* Icon */}
          <div className="mx-auto w-14 h-14 bg-muted border border-border rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-7 h-7 text-primary" />
          </div>
          
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            Application Submitted
          </DialogTitle>
          
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            We've successfully received your application. The client will review your profile and reach out if it's a good fit.
          </p>
        </DialogHeader>

        {/* Visual separator */}
        <div className="w-full h-px bg-border my-2" />

        <div className="flex flex-col gap-3 py-2">
          <Button 
            onClick={handleGoToProposals}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View My Proposals
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleBrowseMore}
            className="w-full h-11 bg-background text-foreground border-border font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            Find More Work
          </Button>
        </div>

        <DialogFooter className="flex justify-center pt-2 border-t border-border mt-2">
          <button 
            onClick={handleGiveFeedback}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer mx-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Have a minute? Give us feedback
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
