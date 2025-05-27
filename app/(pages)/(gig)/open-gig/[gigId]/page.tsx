"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  ArrowLeft,
  Eye,
  Globe,
  Pen,
  Trash2,
  Star,
  DollarSign,
  Users,
  Briefcase,
  Shield,
  Mail,
  MessageCircle,
  Twitter,
  ExternalLink,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

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
  displayContactLinks?: boolean
  contact?: {
    email?: string
    whatsapp?: string
    x?: string
  }
  budget?: number
  updatedAt: string
}

interface Owner {
  id: string
  name: string
  email: string
}

function OpenGig() {
  const [gig, setGig] = useState<Gig | null>(null)
  const [owner, setOwner] = useState<Owner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPinged, setIsPinged] = useState(false);
  const router = useRouter()

  const params = useParams()
  const gigId = params.gigId
  const { data: session } = useSession()
  const user = session?.user

  const fetchGig = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/gigs/open-gigs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gigId }),
      })

      const data = await response.json()

      if (response.ok && data.gig) {
        setGig(data.gig)
        setOwner(data.owner)
      } else {
        console.log("Error in response:", data)
        setError(data.message || data.error || "Failed to fetch gig")
      }
    } catch (error) {
      console.error("Error fetching gig:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  //check pinged status
  useEffect(() => {
    const handlePinged = async () => {
      try {
        const response = await fetch("/api/ping/check-if-pinged", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userEmail: session?.user.email,
            projectId: gigId,
          })
        })
        const data = await response.json();
        setIsPinged(data.pinged);
        console.log(data);
      } catch (error) {
        console.error("Error checking ping status:", error);
      }
    }
    handlePinged();
  }, [gigId, session?.user.email])


  const handleDelete = async () => {
    if (!gig) return

    const confirmed = confirm("Are you sure you want to delete this gig?")
    if (!confirmed) return

    try {
      const response = await fetch(`/api/gigs/open-gigs`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gigId: gig._id }),
      })

      if (response.ok) {
        alert("Gig deleted successfully!")
        router.push("/view-gigs")
      } else {
        const data = await response.json()
        alert(data.message || "Failed to delete gig")
      }
    } catch (error) {
      console.error("Error deleting gig:", error)
      alert("An error occurred while deleting the gig")
    }
  }

  const toggleContactVisibility = async () => {
    if (!gig) return

    try {
      const response = await fetch(`/api/gigs/open-gigs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gigId: gig._id,
          displayContactLinks: !gig.displayContactLinks,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGig({ ...gig, displayContactLinks: !gig.displayContactLinks })
      } else {
        const data = await response.json()
        alert(data.message || "Failed to update contact visibility")
      }
    } catch (error) {
      console.error("Error updating contact visibility:", error)
      alert("An error occurred while updating contact visibility")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just posted"
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
          bgGradient: "from-green-50 to-emerald-50",
          icon: CheckCircle,
        }
      case "completed":
        return {
          color: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          bgGradient: "from-blue-50 to-cyan-50",
          icon: Star,
        }
      case "expired":
        return {
          color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          bgGradient: "from-red-50 to-rose-50",
          icon: Clock,
        }
      case "accepted":
        return {
          color: "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
          bgGradient: "from-purple-50 to-violet-50",
          icon: Users,
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200",
          dot: "bg-gray-500",
          bgGradient: "from-gray-50 to-slate-50",
          icon: Briefcase,
        }
    }
  }

  // Helper function to check if gig is available for applications
  const isGigAvailableForApplication = () => {
    if (!gig) return false

    const status = gig.status.toLowerCase()
    const now = new Date()
    const expiry = new Date(gig.expiresAt)

    // Check if gig is expired
    const isExpired = now > expiry

    // Gig is available only if it's active and not expired
    return status === "active" && !isExpired
  }

  // Helper function to get disabled button message
  const getDisabledButtonMessage = () => {
    if (!gig) return ""

    const status = gig.status.toLowerCase()
    const now = new Date()
    const expiry = new Date(gig.expiresAt)
    const isExpired = now > expiry

    if (isExpired) return "This gig has expired"
    if (status === "completed") return "This gig has been completed"
    if (status === "accepted") return "This gig has been accepted"

    return ""
  }

  useEffect(() => {
    if (gigId) {
      fetchGig()
    } else {
      setError("No gig ID provided")
      setLoading(false)
    }
  }, [gigId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div
                className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-green-500 animate-spin mx-auto"
                style={{ animationDelay: "0.3s", animationDuration: "1.5s" }}
              ></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Gig Details</h3>
            <p className="text-gray-600 text-lg">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">{error}</p>
            <button
              onClick={fetchGig}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Eye className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Gig Not Found</h3>
            <p className="text-gray-600 text-lg">The gig you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(gig.status)
  const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0
  const canApply = isGigAvailableForApplication()
  const disabledMessage = getDisabledButtonMessage()
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${statusConfig.bgGradient} border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Gigs
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Gig Details</span>
            </div>
          </div>

          {/* Title and Status */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge
                  variant="outline"
                  className={`${statusConfig.color} border font-bold text-sm px-4 py-2 flex items-center gap-2 shadow-sm`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`}></div>
                  <StatusIcon className="w-4 h-4" />
                  {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                </Badge>
                {gig.isFlagged && (
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 font-semibold shadow-sm"
                  >
                    🚩 Flagged
                  </Badge>
                )}
                {isExpiringSoon && (
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 font-semibold animate-pulse shadow-sm"
                  >
                    ⏰ Expiring Soon
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {gig.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-600">
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="text-sm text-gray-500 block">Posted</span>
                    <span className="font-semibold text-gray-900">{getTimeAgo(gig.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="text-sm text-gray-500 block">Expires</span>
                    <span className={`font-semibold ${isExpiringSoon ? "text-amber-600" : "text-gray-900"}`}>
                      {daysUntilExpiry > 0 ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left` : "Today"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <User className="w-5 h-5 text-purple-500" />
                  <div>
                    <span className="text-sm text-gray-500 block">Posted by</span>
                    <span className="font-semibold text-gray-900">{owner?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4 lg:w-auto w-full">
              {user?.email === gig.createdBy ? (
                <button
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={() => router.push(`/applications/view-applications?gigId=${gig._id}`)}
                >
                  <Users className="w-5 h-5" />
                  View Applications
                </button>
              ) : (
                <>
                  {canApply ? (
                    <>
                      {isPinged === true ? (
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-400 text-gray-600 rounded-xl font-bold cursor-not-allowed opacity-60"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            router.push(`/ping/ping-project?gigId=${gig._id}${owner ? `&posterId=${owner.id}` : ""}`)
                          }
                          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Apply Now
                        </button>
                      )}
                    </>
                  ) : (
                    <div>
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-400 text-gray-600 rounded-xl font-bold cursor-not-allowed opacity-60"
                        title={disabledMessage}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Apply Now
                      </button>
                      {disabledMessage && (
                        <p className="text-sm text-gray-600 mt-2 text-center bg-white/60 rounded-lg px-3 py-2">
                          {disabledMessage}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  Project Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{gig.description}</p>
                </div>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  Skills & Technologies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gig.skillsRequired.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 text-center group hover:from-blue-100 hover:to-green-100 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-md"
                    >
                      <span className="text-blue-700 font-semibold text-sm group-hover:scale-105 transition-transform duration-200 inline-block">
                        {skill.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {gig.contact && (gig.contact.email || gig.contact.whatsapp || gig.contact.x) && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      Contact Information
                    </h2>
                    {user?.email === gig.createdBy && (
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 sm:px-4 py-2">
                        <span className="text-sm font-medium text-gray-600">
                          {gig.displayContactLinks ? "Public" : "Private"}
                        </span>
                        <Switch checked={gig.displayContactLinks} onCheckedChange={toggleContactVisibility} />
                      </div>
                    )}
                  </div>

                  {gig.displayContactLinks === true || user?.email === gig.createdBy ? (
                    <div className="space-y-4">
                      {/* Email and WhatsApp in a responsive grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gig.contact.email && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3 mb-3">
                              <Mail className="w-5 h-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-900">Email</h4>
                            </div>
                            <p className="text-gray-700 font-medium text-sm sm:text-base break-all mb-3">
                              {gig.contact.email}
                            </p>
                            <a
                              href={`mailto:${gig.contact.email}`}
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Send Email
                            </a>
                          </div>
                        )}

                        {gig.contact.whatsapp && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3 mb-3">
                              <MessageCircle className="w-5 h-5 text-green-600" />
                              <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                            </div>
                            <p className="text-gray-700 font-medium text-sm sm:text-base mb-3">
                              {gig.contact.whatsapp}
                            </p>
                            <a
                              href={`https://wa.me/${gig.contact.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open WhatsApp
                            </a>
                          </div>
                        )}
                      </div>

                      {/* X (Twitter) in full width if exists */}
                      {gig.contact.x && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <Twitter className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-900">X (Twitter)</h4>
                          </div>
                          <p className="text-gray-700 font-medium text-sm sm:text-base break-all mb-3">
                            {gig.contact.x}
                          </p>
                          <a
                            href={`https://x.com/${gig.contact.x}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium text-sm sm:text-base"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Profile
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
                      <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium text-base sm:text-lg">Contact information is private</p>
                      <p className="text-gray-500 text-sm sm:text-base mt-2">
                        Apply to this gig to get contact details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Project Details Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden sticky top-8 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Project Details
                </h3>

                <div className="space-y-4">
                  {/* Budget */}
                  {gig.budget && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-gray-600 font-medium">Budget</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">{gig.budget}</span>
                      </div>
                    </div>
                  )}

                  {/* Posted Date */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Posted</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{formatDate(gig.createdAt)}</span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-600 font-medium">Expires</span>
                    </div>
                    <span className={`font-semibold ${isExpiringSoon ? "text-amber-600" : "text-gray-900"}`}>
                      {formatDate(gig.expiresAt)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-600 font-medium">Status</span>
                    </div>
                    <Badge variant="outline" className={`${statusConfig.color} border font-semibold`}>
                      <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></div>
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 space-y-4">
                  {user?.email !== gig.createdBy ? (
                    <>
                      {canApply ? (
                        <>
                          {isPinged === true ? (
                            <button
                              disabled
                              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gray-400 text-gray-600 rounded-xl font-bold cursor-not-allowed opacity-60"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Applied
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                router.push(`/ping/ping-project?gigId=${gig._id}${owner ? `&posterId=${owner.id}` : ""}`)
                              }
                              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Apply for this Gig
                            </button>
                          )}
                        </>
                      ) : (
                        <div>
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gray-400 text-gray-600 rounded-xl font-bold cursor-not-allowed opacity-60"
                            title={disabledMessage}
                          >
                            <CheckCircle className="w-5 h-5" />
                            Apply for this Gig
                          </button>
                          {disabledMessage && (
                            <p className="text-sm text-gray-600 mt-3 text-center bg-gray-50 rounded-lg px-3 py-2">
                              {disabledMessage}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ) : null}

                  {user?.email === gig.createdBy ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => router.push(`/edit-gig/${gig._id}`)}
                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Pen className="w-5 h-5" />
                        Edit Gig
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete Gig
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenGig
