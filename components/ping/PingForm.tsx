"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Send, LinkIcon, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Gig
      </button>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>

          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">Apply for this Project</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tell the project owner why you're the perfect fit for this gig
            </p>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div className="px-6 sm:px-8 pt-6">
              {error && (
                <div className="flex items-start gap-3 bg-destructive text-destructive-foreground rounded-xl p-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-start gap-3 bg-muted text-foreground rounded-xl p-4 border border-border">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}
            </div>
          )}

          {/* Fields */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold text-foreground">
                Your Message <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you're interested in this project. Highlight relevant skills and experience."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[140px] bg-background border-2 border-border focus:border-primary resize-none text-base rounded-xl"
                required
              />
              <p className="text-xs text-muted-foreground">
                This message will be sent to the project owner. Be professional and concise.
              </p>
            </div>

            {/* Portfolio Link */}
            <div className="space-y-2">
              <label htmlFor="bestWorkLink" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" />
                Portfolio or Best Work Link
              </label>
              <Input
                id="bestWorkLink"
                type="url"
                placeholder="https://your-portfolio.com"
                value={formData.bestWorkLink}
                onChange={(e) => setFormData({ ...formData, bestWorkLink: e.target.value })}
                className="bg-background border-2 border-border focus:border-primary h-11 text-base rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Share a link to your portfolio, GitHub, or a specific project that showcases your skills.
              </p>
            </div>

            {/* Work Description */}
            <div className="space-y-2">
              <label htmlFor="bestWorkDescription" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Work Description
              </label>
              <Textarea
                id="bestWorkDescription"
                placeholder="Briefly describe your relevant experience or the work you've linked above."
                value={formData.bestWorkDescription}
                onChange={(e) => setFormData({ ...formData, bestWorkDescription: e.target.value })}
                className="min-h-[100px] bg-background border-2 border-border focus:border-primary resize-none text-base rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Explain what makes your work impressive and relevant to this project.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 sm:px-8 pb-6 sm:pb-8 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="border-border font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground px-8 font-semibold"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Application</>
              )}
            </Button>
          </div>

        </form>
      </div>

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
