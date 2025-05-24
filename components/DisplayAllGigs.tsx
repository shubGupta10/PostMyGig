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

function DisplayAllGigs() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchAllGigs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/gigs/fetch-gigs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch gigs")
      }

      const data = await response.json()
      setGigs(data.gigs || [])
      console.log(data.gigs)
    } catch (error) {
      console.error("Failed to fetch gigs", error)
      setError("Failed to load gigs. Please try again later.")
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
          color: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200 shadow-emerald-100",
          dot: "bg-gradient-to-r from-emerald-400 to-green-500",
          icon: Zap,
        }
      case "completed":
        return {
          color: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 shadow-blue-100",
          dot: "bg-gradient-to-r from-blue-400 to-indigo-500",
          icon: Award,
        }
      case "expired":
        return {
          color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100",
          dot: "bg-gradient-to-r from-red-400 to-rose-500",
          icon: Clock,
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200 shadow-gray-100",
          dot: "bg-gradient-to-r from-gray-400 to-slate-500",
          icon: Target,
        }
    }
  }

  useEffect(() => {
    fetchAllGigs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-500 shadow-lg"></div>
              <div
                className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin"
                style={{ animationDelay: "0.3s", animationDuration: "1.5s" }}
              ></div>
              <div
                className="absolute inset-2 rounded-full h-12 w-12 border-4 border-transparent border-t-emerald-300 animate-spin"
                style={{ animationDelay: "0.6s", animationDuration: "2s" }}
              ></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-slate-700">Discovering amazing gigs...</p>
              <p className="text-slate-500">Finding the perfect opportunities for you</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-slate-900">Oops! Something went wrong</h3>
              <p className="text-slate-600 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={fetchAllGigs}
              className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {gigs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Briefcase className="w-16 h-16 text-slate-400" />
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">No gigs available yet</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Be the first to discover new opportunities! Check back soon or create your own gig to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-200 mb-4">
                <Star className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">{gigs.length} Amazing Opportunities</span>
              </div>
            </div>

            {/* Gigs Grid */}
            <div className="grid gap-8 lg:gap-6">
              {gigs.map((gig, index) => {
                const statusConfig = getStatusConfig(gig.status)
                const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
                const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={gig._id}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden relative"
                    style={{
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative p-8 lg:p-10">
                      {/* Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                        {/* Title and Status */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="flex-1">
                              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300 leading-tight mb-2">
                                {gig.title}
                              </h2>
                              <p className="text-slate-600 text-lg leading-relaxed">{gig.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`${statusConfig.color} shadow-lg font-bold text-sm px-4 py-2 flex items-center gap-2 border-2`}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot} shadow-sm`}></div>
                            <StatusIcon className="w-4 h-4" />
                            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                          </Badge>
                          {gig.isFlagged && (
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border-orange-200 shadow-orange-100 shadow-lg font-semibold"
                            >
                              ⚠️ Flagged
                            </Badge>
                          )}
                          {isExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100 shadow-lg font-semibold animate-pulse"
                            >
                              🔥 Expiring Soon
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="mb-8">
                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-emerald-600" />
                          </div>
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {gig.skillsRequired.slice(0, 6).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 hover:from-emerald-100 hover:to-green-100 transition-all duration-200 px-4 py-2 font-semibold border border-emerald-200 shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                          {gig.skillsRequired.length > 6 && (
                            <Badge
                              variant="secondary"
                              className="text-sm bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 px-4 py-2 font-semibold shadow-sm"
                            >
                              +{gig.skillsRequired.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Footer Row */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-8 border-t border-slate-100">
                        {/* Date Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            <span className="font-medium text-slate-700">Posted {getTimeAgo(gig.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                            <Clock className="w-5 h-5 text-slate-500" />
                            <span className={`font-medium ${isExpiringSoon ? "text-orange-700" : "text-slate-700"}`}>
                              {daysUntilExpiry > 0
                                ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left`
                                : "Expires today"}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => router.push(`/open-gig/${gig._id}`)}
                          className="group/btn inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-blue-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 hover:scale-105 lg:w-auto w-full relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative">Open Gig</span>
                          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300 relative" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayAllGigs
