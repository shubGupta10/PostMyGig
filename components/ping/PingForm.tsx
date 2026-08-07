"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Send, LinkIcon, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import FeedbackDialog from "@/components/FeedbackDialog"
import { submitPingService } from "@/app/(pages)/ping/ping-project/services/pingService"
import type { PingFormData } from "@/app/(pages)/ping/ping-project/types"

export function PingForm() {
  const { data } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const gigId = searchParams.get("gigId") as string
  const posterId = searchParams.get("posterId") as string

  const [formData, setFormData] = useState<PingFormData>({
    projectId: gigId,
    userEmail: data?.user.email,
    posterId,
    message: "",
    bestWorkLink: "",
    bestWorkDescription: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)

  useEffect(() => {
    if (data?.user?.email) {
      setFormData((prev) => ({ ...prev, userEmail: data.user.email }))
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.message.trim()) {
      setError("Please provide a message to the project owner")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const message = await submitPingService(formData)
      setSuccess(message)
      setFormData((prev) => ({ ...prev, message: "", bestWorkLink: "", bestWorkDescription: "" }))
      setShowFeedbackDialog(true)
      toast.success("Application Submitted")
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your application")
      toast.error("Application failed to submit")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Gig
      </button>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
          Apply for this <span className="text-primary">Project</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
          Tell the project owner why you're the perfect fit for this gig
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 max-w-3xl">
        {/* Section 1: Pitch Message */}
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Your Application Pitch
          </p>

          {/* Error / Success Alerts */}
          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-foreground bg-muted p-4 rounded-xl border border-border">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm sm:text-base font-semibold text-foreground">
              Your Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why you're interested in this project. Highlight relevant skills and experience."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="text-sm bg-background border-2 border-border focus:border-primary resize-none placeholder:text-muted-foreground"
              required
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              This message will be sent directly to the project owner. Be professional and concise.
            </p>
          </div>
        </div>

        {/* Section 2: Work & Portfolio (Optional) */}
        <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Portfolio & Previous Work (Optional)
          </p>

          {/* Best Work Link */}
          <div className="space-y-2">
            <Label htmlFor="bestWorkLink" className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Portfolio or Best Work Link
            </Label>
            <Input
              id="bestWorkLink"
              type="url"
              placeholder="https://your-portfolio.com"
              value={formData.bestWorkLink}
              onChange={(e) => setFormData({ ...formData, bestWorkLink: e.target.value })}
              className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Share a link to your portfolio, GitHub, or a specific project that showcases your skills.
            </p>
          </div>

          {/* Work Description */}
          <div className="space-y-2">
            <Label htmlFor="bestWorkDescription" className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Work Description
            </Label>
            <Textarea
              id="bestWorkDescription"
              placeholder="Briefly describe your relevant experience or the work you've linked above..."
              value={formData.bestWorkDescription}
              onChange={(e) => setFormData({ ...formData, bestWorkDescription: e.target.value })}
              rows={3}
              className="text-sm bg-background border-2 border-border focus:border-primary resize-none placeholder:text-muted-foreground"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explain what makes your work impressive and relevant to this project.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 sm:pt-8 border-t border-border">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Submitting Application...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Application
              </div>
            )}
          </Button>
        </div>
      </form>

      <FeedbackDialog
        open={showFeedbackDialog}
        onClose={() => {
          setShowFeedbackDialog(false)
          router.push("/application-submitted")
        }}
      />
    </div>
  )
}
