"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  Star,
  Briefcase,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Zap,
  Target,
  Award,
  ShieldAlert,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Gig {
  _id: string
  title: string
  description: string
  skillsRequired: string[]
  status: string
  createdAt: string
  expiresAt: string
  createdBy: string
  isFlagged: boolean
  reportCount: number
}

interface RateLimitInfo {
  isLimited: boolean
  retryAfter: string | null
  message: string
  timestamp: number
}

function DisplayAllGigs() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    isLimited: false,
    retryAfter: null,
    message: "",
    timestamp: 0,
  })
  const router = useRouter()

  const fetchAllGigs = async () => {
    try {
      setLoading(true)
      setError(null)
      setRateLimitInfo((prev) => ({ ...prev, isLimited: false, message: "" }))

      const response = await fetch("/api/gigs/fetch-gigs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "60"
        const rateLimitMessage = `Rate limit exceeded. Too many requests. Please wait ${retryAfter} seconds before trying again.`

        setRateLimitInfo({
          isLimited: true,
          retryAfter,
          message: rateLimitMessage,
          timestamp: Date.now(),
        })

        setError(rateLimitMessage)
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch gigs")
      }

      const data = await response.json()
      setGigs(data.gigs || [])
    } catch (error) {
      console.error("Failed to fetch gigs", error)
      const errorMessage = "Failed to load gigs. Please try again later."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const getDaysUntilExpiry = (dateString: string) => {
    const now = new Date()
    const expiry = new Date(dateString)
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffInDays
  }

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
          dot: "bg-green-500",
          icon: Zap,
        }
      case "completed":
        return {
          color: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          icon: Award,
        }
      case "expired":
        return {
          color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          icon: Clock,
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200",
          dot: "bg-gray-500",
          icon: Target,
        }
    }
  }

  const handleRetryClick = () => {
    if (rateLimitInfo.isLimited) {
      // Update the rate limit message to show user tried too early
      setRateLimitInfo((prev) => ({
        ...prev,
        message: `Please wait! You're still rate limited. Try again in ${prev.retryAfter || "a few"} seconds.`,
      }))
      return
    }
    fetchAllGigs()
  }

  useEffect(() => {
    fetchAllGigs()
  }, [])

  // Rate Limit Banner Component
  const RateLimitBanner = () => {
    if (!rateLimitInfo.isLimited) return null

    return (
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-800 mb-1">Rate Limit Exceeded</h4>
            <p className="text-amber-700 text-sm leading-relaxed">{rateLimitInfo.message}</p>
            <div className="mt-2 text-xs text-amber-600">
              <strong>Tip:</strong> To avoid rate limits, try refreshing less frequently.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Rate Limit Banner */}
          <RateLimitBanner />

          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full w-16"></div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Rate Limit Banner */}
          <RateLimitBanner />

          <div className="flex flex-col items-center justify-center py-20">
            <div
              className={`w-20 h-20 ${rateLimitInfo.isLimited ? "bg-gradient-to-br from-amber-50 to-orange-100" : "bg-gradient-to-br from-red-50 to-rose-100"} rounded-2xl flex items-center justify-center mb-8 shadow-lg`}
            >
              {rateLimitInfo.isLimited ? (
                <ShieldAlert className="w-10 h-10 text-amber-500" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900">
                {rateLimitInfo.isLimited ? "Rate Limit Exceeded" : "Oops! Something went wrong"}
              </h3>
              <p className="text-gray-600 leading-relaxed">{error}</p>

              {/* Rate Limit Details */}
              {rateLimitInfo.isLimited && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700 font-medium">Status:</span>
                      <span className="text-amber-800">Rate Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700 font-medium">Retry After:</span>
                      <span className="text-amber-800">{rateLimitInfo.retryAfter || "Unknown"} seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700 font-medium">Time:</span>
                      <span className="text-amber-800">{new Date(rateLimitInfo.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleRetryClick}
              disabled={rateLimitInfo.isLimited}
              className={`mt-8 inline-flex items-center gap-3 px-8 py-4 ${
                rateLimitInfo.isLimited
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105"
              } text-white rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold`}
            >
              <RefreshCw className={`w-5 h-5 ${rateLimitInfo.isLimited ? "" : ""}`} />
              {rateLimitInfo.isLimited ? "Please Wait..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rate Limit Banner */}
        <RateLimitBanner />

        {gigs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Briefcase className="w-16 h-16 text-blue-500" />
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-2xl font-bold text-gray-900">No gigs available yet</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Be the first to discover new opportunities! Check back soon or create your own gig to get started.
              </p>
              <button
                onClick={() => router.push("/post-project")}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
              >
                <Briefcase className="w-4 h-4" />
                Post Your First Gig
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Gigs Grid */}
            <div className="space-y-6">
              {gigs.map((gig, index) => {
                const statusConfig = getStatusConfig(gig.status)
                const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
                const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={gig._id}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="p-6 sm:p-8">
                      {/* Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                        {/* Title and Description */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                            {gig.title}
                          </h2>
                          <p className="text-gray-600 leading-relaxed line-clamp-2">{gig.description}</p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${statusConfig.color} font-medium text-sm px-3 py-1 flex items-center gap-2`}
                          >
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                            <StatusIcon className="w-3 h-3" />
                            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                          </Badge>
                          {gig.isFlagged && (
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 font-medium"
                            >
                               Flagged
                            </Badge>
                          )}
                          {isExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 font-medium animate-pulse"
                            >
                               Expiring Soon
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-blue-500" />
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {gig.skillsRequired.slice(0, 6).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 hover:from-blue-100 hover:to-green-100 transition-all duration-200 px-3 py-1 font-medium border border-blue-200"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                          {gig.skillsRequired.length > 6 && (
                            <Badge
                              variant="secondary"
                              className="text-sm bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 font-medium"
                            >
                              +{gig.skillsRequired.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Footer Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                        {/* Date Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {getTimeAgo(gig.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className={isExpiringSoon ? "text-red-600 font-medium" : ""}>
                              {daysUntilExpiry > 0
                                ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left`
                                : "Expires today"}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => router.push(`/open-gig/${gig._id}`)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:w-auto w-full"
                        >
                          <span>Open Gig</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load More Button */}
            <div className="text-center pt-8">
              <button
                onClick={handleRetryClick}
                disabled={rateLimitInfo.isLimited}
                className={`inline-flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-lg transition-colors duration-200 font-medium ${
                  rateLimitInfo.isLimited ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                {rateLimitInfo.isLimited ? "Rate Limited" : "Load More Gigs"}
              </button>

              {/* Rate limit text under button */}
              {rateLimitInfo.isLimited && (
                <p className="text-sm text-amber-600 mt-2">
                  Please wait {rateLimitInfo.retryAfter || "a moment"} seconds before loading more
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayAllGigs
