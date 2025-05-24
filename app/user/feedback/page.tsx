"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Loader2, CheckCircle, Star, Users, Zap, Shield } from "lucide-react"
import { useSession } from "next-auth/react"

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
    } catch (error: any) {
      console.error("Feedback submission error:", error)
      alert(error.message || "Failed to submit feedback.")
    } finally {
      setIsLoading(false)
    }
  }

  const feedbackTypes = [
    { id: "general", label: "General", icon: MessageSquare, color: "bg-slate-500" },
    { id: "suggestion", label: "Suggestion", icon: Star, color: "bg-amber-500" },
    { id: "issue", label: "Issue", icon: Shield, color: "bg-orange-500" },
    { id: "bug", label: "Bug", icon: Zap, color: "bg-red-500" },
    { id: "feature", label: "Feature", icon: Star, color: "bg-purple-500" },
    { id: "other", label: "Other", icon: Users, color: "bg-gray-500" },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thank You!</h2>
                <p className="text-slate-600 dark:text-slate-400">Your feedback has been submitted successfully.</p>
              </div>
              <Button onClick={() => setSubmitted(false)} className="mt-4 bg-slate-900 hover:bg-slate-800 text-white">
                Submit Another Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Feedback</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Help us improve our service by sharing your thoughts
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Side - Minimal Information */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-slate-600 dark:text-slate-400">• We review all feedback within 24 hours</p>
                    <p className="text-slate-600 dark:text-slate-400">• Critical issues get immediate attention</p>
                    <p className="text-slate-600 dark:text-slate-400">• Your input helps improve our service</p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 text-white">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-slate-200">For urgent issues, contact support directly.</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-9">
              <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                        <Input
                          value={userName}
                          readOnly
                          className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <Input
                          value={userEmail}
                          readOnly
                          className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Feedback Type</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {feedbackTypes.map((type) => {
                          const IconComponent = type.icon
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFeedbackType(type.id)}
                              className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-all border ${
                                feedbackType === type.id
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <div className={`h-8 w-8 ${type.color} rounded-lg flex items-center justify-center`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {type.label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Message</label>
                      <Textarea
                        name="feedback"
                        placeholder="Tell us what you think..."
                        required
                        className="min-h-[140px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
