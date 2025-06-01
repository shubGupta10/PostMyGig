"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
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
  Eye,
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

  const fetchAllGigs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setRateLimitInfo((prev) => ({ ...prev, isLimited: false, message: "" }))

      const response = await fetch("/api/gigs/fetch-gigs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Disable caching to ensure fresh data
        cache: "no-store",
      })

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "60"
        const rateLimitMessage = `Rate limit exceeded. Too many requests. Please wait ${retryAfter} seconds before trying again.`

        const newRateLimitInfo = {
          isLimited: true,
          retryAfter,
          message: rateLimitMessage,
          timestamp: Date.now(),
        }

        setRateLimitInfo(newRateLimitInfo)
        setError(rateLimitMessage)
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch gigs: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // Debug log to see what's coming from API

      const fetchedGigs = data.gigs || []
      console.log("Fetched gigs:", fetchedGigs) // Debug log to see the gigs array

      setGigs(fetchedGigs)

      setRateLimitInfo({
        isLimited: false,
        retryAfter: null,
        message: "",
        timestamp: 0,
      })
    } catch (error) {
      console.error("Failed to fetch gigs", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load gigs. Please try again later."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Memoized date formatting functions
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [])

  const getTimeAgo = useCallback(
    (dateString: string) => {
      const now = new Date()
      const date = new Date(dateString)
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Just now"
      if (diffInHours < 24) return `${diffInHours}h ago`
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d ago`
      return formatDate(dateString)
    },
    [formatDate],
  )

  const getDaysUntilExpiry = useCallback((dateString: string) => {
    const now = new Date()
    const expiry = new Date(dateString)
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffInDays
  }, [])

  // Memoized status configuration
  const getStatusConfig = useMemo(
    () => (status: string) => {
      switch (status.toLowerCase()) {
        case "active":
          return {
            color: "bg-accent text-accent-foreground border-accent",
            dot: "bg-primary",
            icon: Zap,
            borderColor: "border-primary",
          }
        case "completed":
          return {
            color: "bg-secondary text-secondary-foreground border-secondary",
            dot: "bg-primary",
            icon: Award,
            borderColor: "border-primary",
          }
        case "expired":
          return {
            color: "bg-destructive/10 text-destructive border-destructive/20",
            dot: "bg-destructive",
            icon: Clock,
            borderColor: "border-destructive",
          }
        case "accepted":
          return {
            color: "bg-primary/10 text-primary border-primary/20",
            dot: "bg-primary",
            icon: Award,
            borderColor: "border-primary",
          }
        default:
          return {
            color: "bg-muted text-muted-foreground border-border",
            dot: "bg-muted-foreground",
            icon: Target,
            borderColor: "border-border",
          }
      }
    },
    [],
  )

  const handleRetryClick = useCallback(() => {
    if (rateLimitInfo.isLimited) {
      setRateLimitInfo((prev) => ({
        ...prev,
        message: `Please wait! You're still rate limited. Try again in ${prev.retryAfter || "a few"} seconds.`,
      }))
      return
    }
    fetchAllGigs()
  }, [rateLimitInfo.isLimited, fetchAllGigs])

  const handleRefreshClick = useCallback(() => {
    fetchAllGigs()
  }, [fetchAllGigs])

  // Load data on mount
  useEffect(() => {
    fetchAllGigs()
  }, [fetchAllGigs])

  // Memoized components to prevent unnecessary re-renders
  const RateLimitBanner = useMemo(() => {
    if (!rateLimitInfo.isLimited) return null

    return (
      <div className="mb-8 bg-accent border border-accent rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/50 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-6 h-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-accent-foreground mb-2 text-lg">Rate Limit Exceeded</h4>
            <p className="text-accent-foreground/80 leading-relaxed">{rateLimitInfo.message}</p>
            <div className="mt-3 text-sm text-accent-foreground bg-accent/30 rounded-lg p-3 shadow-sm">
              <strong>Tip:</strong> To avoid rate limits, try refreshing less frequently.
            </div>
          </div>
        </div>
      </div>
    )
  }, [rateLimitInfo])

  // Memoized gig cards
  const gigCards = useMemo(() => {
    return gigs.map((gig, index) => {
      const statusConfig = getStatusConfig(gig.status)
      const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
      const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0
      const StatusIcon = statusConfig.icon

      return (
        <div
          key={gig._id}
          className={`group bg-card rounded-3xl border-t-4 ${statusConfig.borderColor} border-l border-r border-b border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[500px] sm:min-h-[520px] lg:min-h-[540px]`}
        >
          <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
            {/* Header with Status Badges */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <Badge
                variant="outline"
                className={`${statusConfig.color} font-semibold text-sm px-4 py-2 flex items-center gap-2 flex-shrink-0`}
              >
                <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                <StatusIcon className="w-4 h-4" />
                {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
              </Badge>

              <div className="flex flex-col gap-2">
                {gig.isFlagged && (
                  <Badge
                    variant="outline"
                    className="bg-accent text-accent-foreground border-accent font-semibold text-sm px-3 py-1"
                  >
                    🚩 Flagged
                  </Badge>
                )}
                {isExpiringSoon && (
                  <Badge
                    variant="outline"
                    className="bg-destructive/10 text-destructive border-destructive/20 font-semibold text-sm px-3 py-1"
                  >
                    ⏰ Expiring
                  </Badge>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight line-clamp-2">{gig.title}</h2>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">
                {gig.description.length > 140 ? `${gig.description.substring(0, 140)}...` : gig.description}
              </p>

              {/* Skills Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Required Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gig.skillsRequired.slice(0, 4).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200 px-3 py-1.5 font-medium border border-secondary"
                    >
                      {skill.trim()}
                    </Badge>
                  ))}
                  {gig.skillsRequired.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="text-sm bg-muted text-muted-foreground border border-border px-3 py-1.5 font-medium"
                    >
                      +{gig.skillsRequired.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-4 mt-8">
              {/* Date Information */}
              <div className="flex justify-between items-center text-sm text-muted-foreground bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-card rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Posted {getTimeAgo(gig.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-card rounded-lg flex items-center justify-center shadow-sm">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span className={`font-medium ${isExpiringSoon ? "text-destructive" : ""}`}>
                    {daysUntilExpiry > 0
                      ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left`
                      : "Expires today"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push(`/open-gig/${gig._id}`)}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                <Eye className="w-5 h-5" />
                <span>View Details</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )
    })
  }, [gigs, getStatusConfig, getDaysUntilExpiry, getTimeAgo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {RateLimitBanner}

          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded-lg w-80 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Cards Skeleton Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-card rounded-3xl border border-border p-8 animate-pulse shadow-lg"
                style={{ aspectRatio: "1 / 1.4" }}
              >
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-8 bg-muted rounded-full w-24"></div>
                    <div className="h-6 bg-muted rounded-full w-16"></div>
                  </div>
                  <div className="h-8 bg-muted rounded w-full mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-6"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                  </div>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-7 bg-muted rounded-full w-20"></div>
                    ))}
                  </div>
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                    <div className="h-12 bg-muted rounded-xl w-full"></div>
                  </div>
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {RateLimitBanner}

          <div className="flex flex-col items-center justify-center py-20">
            <div
              className={`w-24 h-24 ${
                rateLimitInfo.isLimited ? "bg-accent" : "bg-destructive/10"
              } rounded-3xl flex items-center justify-center mb-8 shadow-xl`}
            >
              {rateLimitInfo.isLimited ? (
                <ShieldAlert className="w-12 h-12 text-accent-foreground" />
              ) : (
                <AlertCircle className="w-12 h-12 text-destructive" />
              )}
            </div>
            <div className="text-center space-y-6 max-w-md">
              <h3 className="text-3xl font-bold text-foreground">
                {rateLimitInfo.isLimited ? "Rate Limit Exceeded" : "Oops! Something went wrong"}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{error}</p>

              {rateLimitInfo.isLimited && (
                <div className="bg-accent border border-accent rounded-xl p-6 mt-6 text-left shadow-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-accent-foreground font-medium">Status:</span>
                      <span className="text-accent-foreground font-semibold">Rate Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-accent-foreground font-medium">Retry After:</span>
                      <span className="text-accent-foreground font-semibold">
                        {rateLimitInfo.retryAfter || "Unknown"} seconds
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-accent-foreground font-medium">Time:</span>
                      <span className="text-accent-foreground font-semibold">
                        {new Date(rateLimitInfo.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleRetryClick}
              disabled={rateLimitInfo.isLimited}
              className={`mt-10 inline-flex items-center gap-3 px-10 py-4 ${
                rateLimitInfo.isLimited
                  ? "bg-muted cursor-not-allowed shadow-md text-muted-foreground"
                  : "bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl text-primary-foreground"
              } rounded-xl transition-all duration-200 font-semibold text-lg`}
            >
              <RefreshCw className="w-6 h-6" />
              {rateLimitInfo.isLimited ? "Please Wait..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {RateLimitBanner}

        {gigs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-40 h-40 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
              <Briefcase className="w-20 h-20 text-secondary-foreground" />
            </div>
            <div className="space-y-6 max-w-lg mx-auto">
              <h3 className="text-3xl font-bold text-foreground">No gigs available yet</h3>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Be the first to discover new opportunities! Check back soon or create your own gig to get started.
              </p>
              <button
                onClick={() => router.push("/add-gigs")}
                className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl"
              >
                <Briefcase className="w-5 h-5" />
                Post Your First Gig
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Header with Refresh and Debug Info */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {gigs.length} gig{gigs.length !== 1 ? "s" : ""}
              </div>
              <button
                onClick={handleRefreshClick}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors duration-200 text-sm font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* Gigs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">{gigCards}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayAllGigs
