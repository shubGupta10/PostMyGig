"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Send, LinkIcon, FileText, AlertCircle, CheckCircle, ArrowRight, Sparkles, Check, AlertTriangle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ApplicationSuccessModal } from "@/components/ping/ApplicationSuccessModal"
import { submitPingService } from "@/app/(pages)/ping/ping-project/services/pingService"
import type { PingFormData } from "@/app/(pages)/ping/ping-project/types"
import { useUserData, useUserStore } from "@/store/userDataStore"

export function PingForm() {
  const { data } = useSession()
  const userData = useUserData()
  const { fetchUserData } = useUserStore()
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
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Ensure user data is in sync
  useEffect(() => {
    if (!userData && data?.user?.id) {
      fetchUserData(data.user.id)
    }
  }, [userData, data, fetchUserData])

  useEffect(() => {
    if (data?.user?.email) {
      setFormData((prev) => ({ ...prev, userEmail: data.user.email }))
    }
  }, [data])

  // Profile completeness check
  const hasBio = Boolean(userData?.bio && userData.bio.trim().length >= 20)
  const hasSkills = Boolean(userData?.skills && userData.skills.length >= 2)
  const hasProjects = Boolean(userData?.portfolioProjects && userData.portfolioProjects.length >= 1)
  const isProfileIncomplete = Boolean(userData && (!hasBio || !hasSkills || !hasProjects))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.message.trim()) {
      setError("Please provide a pitch message to the project owner")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const message = await submitPingService(formData)
      setSuccess(message)
      setFormData((prev) => ({ ...prev, message: "", bestWorkLink: "", bestWorkDescription: "" }))
      setShowSuccessModal(true)
      toast.success("Application Submitted")
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your application")
      toast.error("Application failed to submit")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
          Apply for this <span className="text-primary">Project</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Tell the project owner why you're the perfect fit for this gig
        </p>
      </div>

      {/* Profile Completeness Nudge (Full Width) */}
      {isProfileIncomplete && (
        <div className="w-full bg-primary/10 border border-primary/30 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Complete Your Profile for Higher Ranking</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Applications from freelancers with verified skills, bio, and portfolio projects are placed higher in the client's recommended list.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => router.push(`/user/edit?userId=${userData?._id || data?.user?.id}`)}
              className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm h-10 px-5 rounded-xl shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary/20">
            <span className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${hasSkills ? "bg-secondary text-secondary-foreground" : "bg-background border border-border text-muted-foreground"}`}>
              {hasSkills ? <Check className="w-3 h-3 text-primary" /> : <AlertTriangle className="w-3 h-3 text-destructive" />}
              <span>Skills ({userData?.skills?.length || 0}/2)</span>
            </span>

            <span className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${hasProjects ? "bg-secondary text-secondary-foreground" : "bg-background border border-border text-muted-foreground"}`}>
              {hasProjects ? <Check className="w-3 h-3 text-primary" /> : <AlertTriangle className="w-3 h-3 text-destructive" />}
              <span>Projects ({userData?.portfolioProjects?.length || 0}/1)</span>
            </span>

            <span className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${hasBio ? "bg-secondary text-secondary-foreground" : "bg-background border border-border text-muted-foreground"}`}>
              {hasBio ? <Check className="w-3 h-3 text-primary" /> : <AlertTriangle className="w-3 h-3 text-destructive" />}
              <span>Bio Summary</span>
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-8 pb-24">
        {error && (
          <div className="flex items-center gap-2 text-destructive bg-destructive p-4 rounded-xl border border-destructive">
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

        {/* 1. Pitch Field (Big Textarea) */}
        <div className="space-y-2.5">
          <Label htmlFor="message" className="text-base font-semibold text-foreground">
            Your Pitch <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Introduce yourself and explain why you're interested in this project. Highlight relevant skills, past work, and how you plan to execute."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={8}
            className="w-full text-base bg-background border-2 border-border focus:border-primary resize-y placeholder:text-muted-foreground rounded-2xl p-5 leading-relaxed min-h-[200px]"
            required
          />
        </div>

        {/* 2. Proof of Work Link (Input) */}
        <div className="space-y-2.5">
          <Label htmlFor="bestWorkLink" className="text-base font-semibold text-foreground flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            <span>Portfolio or Best Work Link (Optional)</span>
          </Label>
          <Input
            id="bestWorkLink"
            type="url"
            placeholder="https://github.com/... or https://your-portfolio.com"
            value={formData.bestWorkLink}
            onChange={(e) => setFormData({ ...formData, bestWorkLink: e.target.value })}
            className="h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground focus:border-primary rounded-2xl px-5"
          />
        </div>

        {/* 3. Work Description (Big Textarea) */}
        <div className="space-y-2.5">
          <Label htmlFor="bestWorkDescription" className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Work Description & Tech Highlights (Optional)</span>
          </Label>
          <Textarea
            id="bestWorkDescription"
            placeholder="Briefly describe what you built in this project, key features, and relevant tech stack..."
            value={formData.bestWorkDescription}
            onChange={(e) => setFormData({ ...formData, bestWorkDescription: e.target.value })}
            rows={5}
            className="w-full text-base bg-background border-2 border-border focus:border-primary resize-y placeholder:text-muted-foreground rounded-2xl p-5 leading-relaxed min-h-[140px]"
          />
        </div>

        {/* 4. Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-primary-foreground font-bold text-base rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Proposal...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                <span>Submit Proposal</span>
              </div>
            )}
          </Button>
        </div>
      </form>

      <ApplicationSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  )
}
