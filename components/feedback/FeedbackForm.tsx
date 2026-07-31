"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Send, Loader2, CheckCircle, Star,
  Heart, Lightbulb, Shield, Bug, Plus
} from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from 'sonner'
import { submitFeedbackService } from "@/app/user/feedback/services/feedbackService"

export function FeedbackForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [submitted, setSubmitted] = useState(false)

  const session = useSession()
  const user = session.data?.user
  const userName = user?.name || "Guest"
  const userEmail = user?.email || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.target as HTMLFormElement
    const feedback = form.feedback.value

    try {
      await submitFeedbackService({
        name: userName,
        email: userEmail,
        feedback,
        feedbackType,
      })
      setSubmitted(true)
      form.reset()
      setFeedbackType("suggestion")
    } catch (error: any) {
      console.error("Feedback submission error:", error)
      toast.error(error.message || "Failed to submit feedback.")
    } finally {
      setIsLoading(false)
    }
  }

  const feedbackTypes = [
    { id: "suggestion", label: "Suggestion", icon: Lightbulb, color: "text-secondary-foreground" },
    { id: "issue", label: "Issue", icon: Shield, color: "text-destructive" },
    { id: "bug", label: "Bug", icon: Bug, color: "text-destructive" },
    { id: "feature", label: "Feature", icon: Star, color: "text-primary" },
    { id: "other", label: "Other", icon: Plus, color: "text-foreground" },
  ]

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm">
        <div className="p-10 sm:p-16 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-muted rounded-2xl border border-border flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Feedback Received</h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Thank you — your submission has been received and our team will review it shortly.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted border border-border rounded-xl px-5 py-3">
            <Heart className="w-4 h-4 text-destructive shrink-0" />
            <span>Your input helps us build a better platform</span>
          </div>
          <Button onClick={() => setSubmitted(false)} className="bg-primary text-primary-foreground font-semibold px-8">
            Submit Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit}>

        {/* Your Information */}
        <div className="p-6 sm:p-8 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5">Your Information</p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input
                value={userName}
                readOnly
                className="h-11 bg-muted border-border text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                value={userEmail}
                readOnly
                className="h-11 bg-muted border-border text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Feedback Type */}
        <div className="p-6 sm:p-8 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5">Feedback Type</p>
          <div className="flex flex-wrap gap-2.5">
            {feedbackTypes.map((type) => {
              const IconComponent = type.icon
              const isSelected = feedbackType === type.id
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFeedbackType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isSelected ? type.color : "text-muted-foreground"}`} />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Message */}
        <div className="p-6 sm:p-8 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5">Your Message</p>
          <Textarea
            name="feedback"
            placeholder="Tell us what you think — share your experience, suggestions, or any issues you've encountered..."
            required
            className="min-h-[200px] bg-background border-2 border-border focus:border-primary resize-none text-base leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="p-6 sm:p-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}
