"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, AlertCircle, RefreshCw, CheckCircle, ArrowLeft, Eye, Globe, Pen, Trash2Icon } from "lucide-react"
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
          color: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
          dot: "bg-emerald-500",
          bgGradient: "from-emerald-50 to-emerald-100",
        }
      case "completed":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
          dot: "bg-blue-500",
          bgGradient: "from-blue-50 to-blue-100",
        }
      case "expired":
        return {
          color: "bg-red-50 text-red-700 border-red-200 ring-red-100",
          dot: "bg-red-500",
          bgGradient: "from-red-50 to-red-100",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200 ring-gray-100",
          dot: "bg-gray-500",
          bgGradient: "from-gray-50 to-gray-100",
        }
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-500 mx-auto"></div>
              <div
                className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-emerald-300 animate-spin mx-auto"
                style={{ animationDelay: "0.3s", animationDuration: "1.5s" }}
              ></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Gig Details</h3>
            <p className="text-slate-600">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={fetchGig}
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gig Not Found</h3>
            <p className="text-slate-500">The gig you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(gig.status)
  const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${statusConfig.bgGradient} border-b border-slate-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Gigs
            </button>
          </div>

          {/* Title and Status */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge
                  variant="outline"
                  className={`${statusConfig.color} ring-1 font-bold text-sm px-4 py-2 flex items-center gap-2`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`}></div>
                  {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                </Badge>
                {gig.isFlagged && (
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200 ring-orange-100 ring-1 font-semibold"
                  >
                    🚩 Flagged
                  </Badge>
                )}
                {isExpiringSoon && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 ring-amber-100 ring-1 font-semibold animate-pulse"
                  >
                    ⏰ Expiring Soon
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
                {gig.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Posted {getTimeAgo(gig.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {daysUntilExpiry > 0
                      ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} remaining`
                      : "Expires today"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Posted By : {owner?.name}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full">
              {user?.email === gig.createdBy ? <>
                <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1" onClick={() => router.push(
                  `/applications/view-applications?gigId=${gig._id}`
                )}>
                  View Applications
                </button>
              </> : <>
                <button onClick={() => router.push(
                  `/ping/ping-project?gigId=${gig._id}${owner ? `&posterId=${owner.id}` : ''}`
                )} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <CheckCircle className="w-6 h-6" />
                  Apply Now
                </button>
              </>}


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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  Project Description
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">{gig.description}</p>
                </div>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills & Technologies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gig.skillsRequired.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 text-center group hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-emerald-800 font-semibold text-sm group-hover:scale-105 transition-transform duration-200 inline-block">
                        {skill.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {gig.contact && (gig.contact.email || gig.contact.whatsapp || gig.contact.x) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                    {user?.email === gig.createdBy && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 font-medium">
                          {gig.displayContactLinks ? "Visible to public" : "Hidden from public"}
                        </span>
                        <Switch checked={gig.displayContactLinks} onCheckedChange={toggleContactVisibility} />
                      </div>
                    )}
                  </div>

                  {gig.displayContactLinks === true || user?.email === gig.createdBy ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {gig.contact.email && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-900 mb-2">Email</h4>
                          <p className="text-slate-700">{gig.contact.email}</p>
                        </div>
                      )}
                      {gig.contact.whatsapp && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-900 mb-2">WhatsApp</h4>
                          <p className="text-slate-700">{gig.contact.whatsapp}</p>
                        </div>
                      )}
                      {gig.contact.x && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-900 mb-2">X (Twitter)</h4>
                          <p className="text-slate-700">{gig.contact.x}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-6 text-center">
                      <p className="text-slate-700 font-medium">Contact information is hidden by the gig owner</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Project Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Project Details</h3>

                <div className="space-y-4">
                  {/* Budget */}
                  {gig.budget && (
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Budget</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900">{gig.budget}</span>
                      </div>
                    </div>
                  )}

                  {/* Posted Date */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Posted</span>
                    <span className="text-slate-900 font-semibold">{formatDate(gig.createdAt)}</span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Expires</span>
                    <span className={`font-semibold ${isExpiringSoon ? "text-amber-600" : "text-slate-900"}`}>
                      {formatDate(gig.expiresAt)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-600 font-medium">Status</span>
                    <Badge variant="outline" className={`${statusConfig.color} ring-1 font-semibold`}>
                      <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></div>
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 space-y-4">
                  {user?.email !== gig.createdBy ? <>
                    <button
                      onClick={() =>
                        router.push(
                          `/ping/ping-project?gigId=${gig._id}${owner ? `&posterId=${owner.id}` : ''}`
                        )
                      }
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Apply for this Gig
                    </button>
                  </> : null}



                  {user?.email === gig.createdBy ? (
                    <>
                      <button
                        onClick={() => router.push(`/edit-gig/${gig._id}`)}
                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4  text-emerald-600 border-2 border-emerald-600 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Pen className="w-5 h-5" />
                        Edit Gig
                      </button>
                    </>
                  ) : null}

                  {user?.email === gig.createdBy ? (
                    <>
                      <button
                        onClick={handleDelete}
                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-red-600  text-white  border-2 border-red-600 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Trash2Icon className="w-5 h-5" />
                        Delete Gig
                      </button>
                    </>
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
