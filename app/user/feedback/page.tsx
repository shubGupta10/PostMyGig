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
    {
      id: "general",
      label: "General",
      icon: MessageSquare,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "suggestion",
      label: "Suggestion",
      icon: Lightbulb,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      id: "issue",
      label: "Issue",
      icon: Shield,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "bug",
      label: "Bug",
      icon: Bug,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "feature",
      label: "Feature",
      icon: Star,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "other",
      label: "Other",
      icon: Plus,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
          <div className="w-full max-w-lg">
            <Card className="border border-gray-200 shadow-xl bg-white overflow-hidden">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="flex flex-col items-center gap-6 sm:gap-8">
                  {/* Success Animation */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>

                  {/* Success Message */}
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Thank You! 🎉</h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                      Your feedback has been submitted successfully. We appreciate you taking the time to help us
                      improve!
                    </p>
                  </div>

                  {/* Appreciation Note */}
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200 w-full">
                    <div className="flex items-center gap-3 justify-center">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-sm sm:text-base text-gray-700 font-medium">
                        Your input helps us build a better platform
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 sm:mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-700">Share Your Thoughts</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            We Value Your <span className="text-blue-600">Feedback</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Help us improve PostMyGig by sharing your thoughts, suggestions, and experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Enhanced Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Info Card */}
            <Card className="border border-gray-200 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Quick Info</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 leading-relaxed">We review all feedback within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 leading-relaxed">Critical issues get immediate attention</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 leading-relaxed">Your input directly shapes our roadmap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="border border-blue-200 shadow-lg bg-blue-600 text-white overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold">Need Immediate Help?</h4>
                </div>
                <p className="text-blue-100 leading-relaxed mb-6">
                  For urgent issues or technical support, reach out to our team directly.
                </p>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Form */}
          <div className="lg:col-span-8">
            <Card className="border border-gray-200 shadow-xl bg-white overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* User Information */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      Your Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Name</label>
                        <Input
                          value={userName}
                          readOnly
                          className="h-12 bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <Input
                          value={userEmail}
                          readOnly
                          className="h-12 bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Feedback Type Selection */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-blue-600" />
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
                                : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 ${type.color} rounded-xl flex items-center justify-center shadow-lg ${isSelected ? "scale-110" : ""} transition-transform duration-200`}
                            >
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span
                              className={`text-sm sm:text-base font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}
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
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      Your Message
                    </h3>

                    <div className="space-y-2">
                      <Textarea
                        name="feedback"
                        placeholder="Tell us what you think... We'd love to hear about your experience, suggestions for improvement, or any issues you've encountered."
                        required
                        className="min-h-[160px] bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white resize-none text-base leading-relaxed"
                      />
                      <p className="text-sm text-gray-500">
                        Be as detailed as possible - it helps us understand and address your feedback better.
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
