"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  X,
  Users,
  MessageSquare,
  FileText,
  Eye,
  Check,
  Clock,
  XCircle,
  User2,
  Mail,
  Calendar,
  Star,
  Award,
  Briefcase,
  Activity,
  Filter,
  Search,
  Download,
} from "lucide-react"

interface Applyer {
  _id: string
  name: string
  email: string
  profilePhoto?: string
}

interface Application {
  _id: string
  projectId: string
  userEmail: string
  posterEmail?: string
  message: string
  bestWorkLink: string
  status: string
  bestWorkDescription: string
  createdAt: string
  updatedAt: string
  applicant: Applyer
}

interface ContactLink {
  label: string
  url: string
  _id: string
}

interface ContactData {
  email: string
  contactLinks: ContactLink[]
}

function ViewApplication() {
  const searchParams = useSearchParams()
  const gigIdFromSearchParams = searchParams.get("gigId")

  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactData, setContactData] = useState<ContactData | null>(null)

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/applications/fetch-applications?gigId=${gigIdFromSearchParams}`)
      const data = await response.json()
      if (response.ok) {
        setApplications(data.data)
      } else {
        console.error("Error fetching applications", data)
      }
    } catch (error) {
      console.error("Error fetching applications", error)
    }
  }

  useEffect(() => {
    if (gigIdFromSearchParams) {
      fetchApplications()
    } else {
      console.error("Gig ID is required")
    }
  }, [gigIdFromSearchParams])

  // Status badge configuration
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200",
        icon: Clock,
        text: "Pending",
      },
      accepted: {
        color: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
        icon: Check,
        text: "Accepted",
      },
      rejected: {
        color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
        icon: XCircle,
        text: "Rejected",
      },
    }

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} border font-medium flex items-center gap-2 px-3 py-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const getApplicantInitials = (applicant: Application) => {
    if (applicant.applicant.name) {
      const nameParts = applicant.applicant.name.trim().split(" ")
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      }
      return applicant.applicant.name.substring(0, 2).toUpperCase()
    }
    if (applicant.applicant?.email) {
      const name = applicant.applicant.email.split("@")[0]
      return name.substring(0, 2).toUpperCase()
    }
    return "??"
  }

  const getApplicantDisplayName = (applicant: Application) => {
    return applicant.applicant.name || applicant.applicant.email || "Unknown User"
  }

  // Modal handlers
  const openDialog = (applicant: Application) => {
    setSelectedApplicant(applicant)
  }

  const closeDialog = () => {
    setSelectedApplicant(null)
  }

  // Accept application
  const handleAccept = async (applicationId: string, applicantEmail: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/applications/accept-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          applicantEmail,
          gigId: gigIdFromSearchParams,
        }),
      })

      if (!response.ok) {
        alert("Failed to accept applicant")
        return
      }

      alert("Applicant accepted successfully")
      await fetchApplications() // Refresh the list
    } catch (error) {
      console.error("Error accepting applicant:", error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Delete/Reject application
  const handleDeleteApplication = async () => {
    if (!selectedApplicant) return

    setLoading(true)
    try {
      const response = await fetch("/api/applications/delete-applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId: selectedApplicant._id }),
      })

      if (response.ok) {
        alert("Application deleted successfully")
        closeDialog()
        await fetchApplications() // Refresh the list
      } else {
        alert("Error deleting application")
      }
    } catch (error) {
      console.error("Error deleting application", error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleContactApplicant = async (applicantEmail: string) => {
    try {
      const res = await fetch("/api/applications/contact-applicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicantEmail }),
      })
      const ApplicantData = await res.json()
      if (!res.ok) {
        throw new Error(ApplicantData.error || "Failed to contact applicant")
      }

      // Store the contact data from the nested contactDetails object
      setContactData({
        email: ApplicantData.contactDetails.email,
        contactLinks: ApplicantData.contactDetails.contactLinks || [],
      })
      setContactDialogOpen(true)
    } catch (error) {
      console.error("Error contacting applicant:", error)
      alert("Failed to contact applicant. Please try again later.")
    }
  }

  const acceptedCount = applications.filter((app) => app.status?.toLowerCase() === "accepted").length
  const pendingCount = applications.filter((app) => app.status?.toLowerCase() === "pending").length
  const rejectedCount = applications.filter((app) => app.status?.toLowerCase() === "rejected").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
                <p className="text-gray-600 text-lg">
                  Gig ID: <span className="font-semibold text-blue-600">{gigIdFromSearchParams}</span>
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{applications.length}</div>
                <div className="text-sm text-blue-600 font-medium">Total</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
                <div className="text-sm text-amber-600 font-medium">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-700">{acceptedCount}</div>
                <div className="text-sm text-green-600 font-medium">Accepted</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
                <div className="text-sm text-red-600 font-medium">Rejected</div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              No one has applied for this project yet. Share your gig to attract talented applicants!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Enhanced Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-6 items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <div className="col-span-4 flex items-center gap-2">
                  <User2 className="w-4 h-4" />
                  Applicant
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Applied
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Status
                </div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
            </div>

            {/* Applications Rows */}
            <div className="divide-y divide-gray-100">
              {applications.map((applicant, index) => {
                const isAccepted = applicant.status?.toLowerCase() === "accepted"
                const isRejected = applicant.status?.toLowerCase() === "rejected"

                return (
                  <div
                    key={applicant._id}
                    className="px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 group"
                  >
                    <div className="grid grid-cols-12 gap-6 items-center">
                      {/* Enhanced Applicant Info */}
                      <div className="col-span-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-200">
                              {applicant.applicant?.profilePhoto ? (
                                <img
                                  src={applicant.applicant.profilePhoto || "/placeholder.svg"}
                                  alt={getApplicantDisplayName(applicant)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-bold text-lg">{getApplicantInitials(applicant)}</span>
                              )}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                              {getApplicantDisplayName(applicant)}
                            </h3>
                            {applicant.applicant?.name && applicant.applicant?.email && (
                              <p className="text-gray-600 truncate flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {applicant.applicant.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Applied Date */}
                      <div className="col-span-2">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-gray-900">{formatDateShort(applicant.createdAt)}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(applicant.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Status */}
                      <div className="col-span-2">{getStatusBadge(applicant.status || "pending")}</div>


                      {/* Enhanced Actions */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-3 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(applicant)}
                            className="border-blue-200 text-green-600 hover:bg-blue-50 hover:border-blue-300 font-medium"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {applicant.status?.toLowerCase() === "accepted" && (
                            <Button
                              size="sm"
                              onClick={() => handleContactApplicant(applicant.applicant.email)}
                              className="bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600 text-white font-medium shadow-lg"
                            >
                              <User2 className="w-4 h-4 mr-1" />
                              Contact
                            </Button>
                          )}
                          <Button
                            onClick={() => handleAccept(applicant._id, applicant.applicant.email)}
                            size="sm"
                            disabled={isAccepted || isRejected || loading}
                            className={`font-medium shadow-lg ${
                              isAccepted
                                ? "bg-green-100 text-green-800 cursor-not-allowed hover:bg-green-100"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            }`}
                          >
                            {isAccepted ? (
                              <>
                                <Award className="w-4 h-4 mr-1" />
                                Accepted
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Enhanced Modal Dialog */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
              {/* Enhanced Dialog Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                    {selectedApplicant.applicant?.profilePhoto ? (
                      <img
                        src={selectedApplicant.applicant.profilePhoto || "/placeholder.svg"}
                        alt={getApplicantDisplayName(selectedApplicant)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl">{getApplicantInitials(selectedApplicant)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{getApplicantDisplayName(selectedApplicant)}</h2>
                      {getStatusBadge(selectedApplicant.status || "pending")}
                    </div>
                    <div className="space-y-1">
                      {selectedApplicant.applicant?.email && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedApplicant.applicant.email}
                        </p>
                      )}
                      <p className="text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Applied on {formatDate(selectedApplicant.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeDialog}
                  className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Enhanced Dialog Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)]">
                <div className="space-y-8">
                  {/* Enhanced Message Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Application Message</h3>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {selectedApplicant.message}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Work Section */}
                  {(selectedApplicant.bestWorkLink || selectedApplicant.bestWorkDescription) && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Portfolio & Previous Work</h3>
                      </div>
                      <div className="space-y-6">
                        {selectedApplicant.bestWorkLink && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <ExternalLink className="w-5 h-5 text-blue-500" />
                              Work Link
                            </h4>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                              {isValidUrl(selectedApplicant.bestWorkLink) ? (
                                <a
                                  href={selectedApplicant.bestWorkLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 text-lg font-semibold transition-colors bg-white px-6 py-4 rounded-xl border border-blue-300 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                  View Portfolio
                                </a>
                              ) : (
                                <p className="text-gray-700 leading-relaxed text-lg">
                                  {selectedApplicant.bestWorkLink}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedApplicant.bestWorkDescription && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-green-500" />
                              Work Description
                            </h4>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                                {selectedApplicant.bestWorkDescription}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Dialog Footer */}
              <div className="flex justify-end gap-4 p-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                <Button variant="outline" onClick={closeDialog} className="px-8 py-3 font-medium">
                  Close
                </Button>
                <Button
                  onClick={handleDeleteApplication}
                  variant="outline"
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 px-8 py-3 font-medium disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
                <Button
                  onClick={() => handleAccept(selectedApplicant._id, selectedApplicant.applicant.email)}
                  disabled={
                    selectedApplicant.status?.toLowerCase() === "accepted" ||
                    selectedApplicant.status?.toLowerCase() === "rejected" ||
                    loading
                  }
                  className={`px-8 py-3 font-medium ${
                    selectedApplicant.status?.toLowerCase() === "accepted"
                      ? "bg-green-100 text-green-800 cursor-not-allowed hover:bg-green-100"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  }`}
                >
                  {selectedApplicant.status?.toLowerCase() === "accepted" ? (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Already Accepted
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Accept Application
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Contact Dialog */}
        {contactDialogOpen && contactData && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
              {/* Enhanced Contact Dialog Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <User2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-gray-600">Connect with the accepted applicant</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContactDialogOpen(false)}
                  className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Enhanced Contact Dialog Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)]">
                <div className="space-y-8">
                  {/* Enhanced Email Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Email Address</h3>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-gray-700 font-medium">{contactData.email}</span>
                        <Button
                          size="sm"
                          onClick={() => window.open(`mailto:${contactData.email}`, "_blank")}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Contact Links Section */}
                  {contactData.contactLinks && contactData.contactLinks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Additional Contact Methods</h3>
                      </div>
                      <div className="space-y-4">
                        {contactData.contactLinks.map((link, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900 text-lg">{link.label}</p>
                                <p className="text-gray-600 truncate mt-1">{link.url}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => window.open(link.url, "_blank")}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium shadow-lg flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced No Contact Links Message */}
                  {(!contactData.contactLinks || contactData.contactLinks.length === 0) && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <ExternalLink className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No Additional Contact Methods</h3>
                      <p className="text-gray-600 text-lg">
                        The applicant hasn't provided any additional contact links. You can reach them via email.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Contact Dialog Footer */}
              <div className="flex justify-end gap-4 p-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                <Button variant="outline" onClick={() => setContactDialogOpen(false)} className="px-8 py-3 font-medium">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewApplication
