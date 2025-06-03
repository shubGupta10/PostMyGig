"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  Heart,
  Lightbulb,
  Bug,
  Plus,
} from "lucide-react"
import { useSession } from "next-auth/react"
import {toast} from 'sonner'

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackType, setFeedbackType] = useState("general")
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

    const formData = {
      name: userName,
      email: userEmail,
      feedback,
      feedbackType,
    }

    try {
      const res = await fetch("/api/user/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      setSubmitted(true)
      form.reset()
      setFeedbackType("general")
      toast.success("Feedback Submit Successfully")
    } catch (error: any) {
      console.error("Feedback submission error:", error)
      toast.error(error.message || "Failed to submit feedback.")
    } finally {
      setIsLoading(false)
    }
  }

  const feedbackTypes = [
    {
      id: "general",
      label: "General",
      icon: MessageSquare,
      color: "bg-primary dark:bg-accent",
      bgColor: "bg-accent",
      borderColor: "border-accent-foreground",
    },
    {
      id: "suggestion",
      label: "Suggestion",
      icon: Lightbulb,
      color: "bg-primary dark:bg-accent",
      bgColor: "bg-secondary",
      borderColor: "border-secondary-foreground",
    },
    {
      id: "issue",
      label: "Issue",
      icon: Shield,
      color: "bg-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
    },
    {
      id: "bug",
      label: "Bug",
      icon: Bug,
      color: "bg-primary dark:bg-accent",
      bgColor: "bg-primary/10",
      borderColor: "border-primary",
    },
    {
      id: "feature",
      label: "Feature",
      icon: Star,
      color: "bg-primary dark:bg-accent",
      bgColor: "bg-secondary",
      borderColor: "border-secondary-foreground",
    },
    {
      id: "other",
      label: "Other",
      icon: Plus,
      color: "bg-primary dark:bg-accent",
      bgColor: "bg-secondary",
      borderColor: "border-muted-foreground",
    },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
          <div className="w-full max-w-lg">
            <Card className="border-border shadow-xl bg-card overflow-hidden">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="flex flex-col items-center gap-6 sm:gap-8">
                  {/* Success Animation */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary-foreground rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full"></div>
                  </div>

                  {/* Success Message */}
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Thank You! 🎉</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                      Your feedback has been submitted successfully. We appreciate you taking the time to help us
                      improve!
                    </p>
                  </div>

                  {/* Appreciation Note */}
                  <div className="bg-accent rounded-xl p-4 sm:p-6 border border-accent-foreground w-full">
                    <div className="flex items-center gap-3 justify-center">
                      <Heart className="w-5 h-5 text-destructive" />
                      <span className="text-sm sm:text-base text-accent-foreground font-medium">
                        Your input helps us build a better platform
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 sm:mt-6 bg-secondary-foreground hover:bg-secondary-foreground/90 text-secondary px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Submit Another Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            We Value Your <span className="text-primary">Feedback</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Help us improve PostMyGig by sharing your thoughts, suggestions, and experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Enhanced Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Info Card */}
            <Card className="border-border shadow-lg bg-card overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground">Quick Info</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground leading-relaxed">We review all feedback within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground leading-relaxed">Critical issues get immediate attention</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground leading-relaxed">Your input directly shapes our roadmap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="border-border shadow-lg text-primary overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold">Need Immediate Help?</h4>
                </div>
                <p className="text-primary leading-relaxed mb-6">
                  For urgent issues or technical support, reach out to our team directly.
                </p>
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-secondary-foreground via-secondary-foreground to-secondary-foreground hover:from-secondary-foreground/90 hover:via-secondary-foreground/90 hover:to-secondary-foreground/90 text-secondary"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Form */}
          <div className="lg:col-span-8">
            <Card className="border-border shadow-xl bg-card overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* User Information */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-accent-foreground" />
                      </div>
                      Your Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Name</label>
                        <Input
                          value={userName}
                          readOnly
                          className="h-12 bg-muted border-border text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Email</label>
                        <Input
                          value={userEmail}
                          readOnly
                          className="h-12 bg-muted border-border text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Feedback Type Selection */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-accent-foreground" />
                      </div>
                      Feedback Type
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {feedbackTypes.map((type) => {
                        const IconComponent = type.icon
                        const isSelected = feedbackType === type.id

                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id)}
                            className={`p-4 sm:p-6 rounded-xl flex flex-col items-center gap-3 transition-all duration-200 border-2 transform hover:-translate-y-1 hover:shadow-lg ${
                              isSelected
                                ? `${type.bgColor} ${type.borderColor} shadow-lg scale-105`
                                : "border-border bg-muted hover:bg-muted/80 hover:border-muted-foreground"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 ${type.color} rounded-xl flex items-center justify-center shadow-lg ${isSelected ? "scale-110" : ""} transition-transform duration-200`}
                            >
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span
                              className={`text-sm sm:text-base font-semibold ${isSelected ? "text-card-foreground" : "text-muted-foreground"}`}
                            >
                              {type.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Enhanced Message Section */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-accent-foreground" />
                      </div>
                      Your Message
                    </h3>

                    <div className="space-y-2">
                      <Textarea
                        name="feedback"
                        placeholder="Tell us what you think... We'd love to hear about your experience, suggestions for improvement, or any issues you've encountered."
                        required
                        className="min-h-[160px] bg-muted border-border focus:border-primary focus:bg-card resize-none text-base leading-relaxed"
                      />
                      <p className="text-sm text-muted-foreground">
                        Be as detailed as possible - it helps us understand and address your feedback better.
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="pt-6 border-t border-border">
                    <Button
                      type="submit"
                      className="w-full h-14 bg-secondary-foreground hover:bg-secondary-foreground/90 text-secondary font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting Your Feedback...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}