"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, X, Users, MessageSquare, FileText, Eye, Check, Clock, XCircle, User2 } from "lucide-react"

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
  const router = useRouter()

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
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pending" },
      accepted: { color: "bg-green-100 text-green-800", icon: Check, text: "Accepted" },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Rejected" },
    }

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
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

  return (
    <div className="min-h-screen bg-slate-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Applicants</h1>
                <p className="text-sm text-slate-500">Gig ID: {gigIdFromSearchParams}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                {applications.length} {applications.length === 1 ? "Application" : "Applications"}
              </span>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-slate-900 mb-1">No Applications Found</h3>
            <p className="text-sm text-slate-500">No one has applied for this project yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-slate-600 uppercase tracking-wide">
                <div className="col-span-3">Applicant</div>
                <div className="col-span-2">Applied</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Work</div>
                <div className="col-span-3">Actions</div>
              </div>
            </div>

            {/* Applications Rows */}
            <div className="divide-y divide-slate-100">
              {applications.map((applicant, index) => {
                const isAccepted = applicant.status?.toLowerCase() === "accepted"
                const isRejected = applicant.status?.toLowerCase() === "rejected"

                return (
                  <div key={applicant._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Applicant Info */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {applicant.applicant?.profilePhoto ? (
                              <img
                                src={applicant.applicant.profilePhoto || "/placeholder.svg"}
                                alt={getApplicantDisplayName(applicant)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-slate-700">
                                {getApplicantInitials(applicant)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-base font-medium text-slate-900 truncate">
                                  {getApplicantDisplayName(applicant)}
                                </p>
                                {applicant.applicant?.name && applicant.applicant?.email && (
                                  <p className="text-sm text-slate-500 truncate">{applicant.applicant.email}</p>
                                )}
                              </div>
                              <Badge className="bg-emerald-50 text-emerald-700 text-sm px-2 py-1 hover:bg-emerald-50 flex-shrink-0">
                                #{index + 1}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Applied Date */}
                      <div className="col-span-2">
                        <p className="text-base font-medium text-slate-900">{formatDateShort(applicant.createdAt)}</p>
                        <p className="text-sm text-slate-500">{formatDate(applicant.createdAt)}</p>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">{getStatusBadge(applicant.status || "pending")}</div>

                      {/* Work Status */}
                      <div className="col-span-2">
                        {applicant.bestWorkLink || applicant.bestWorkDescription ? (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-600 font-medium">Has work</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">No work</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(applicant)}
                            className="h-8 px-3 text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {applicant.status?.toLowerCase() === "accepted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContactApplicant(applicant.applicant.email)}
                              className="h-8 px-3 text-sm bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                            >
                              <User2 className="w-4 h-4 mr-1" />
                              Contact Applicant
                            </Button>
                          )}
                          <Button
                            onClick={() => handleAccept(applicant._id, applicant.applicant.email)}
                            size="sm"
                            disabled={isAccepted || isRejected || loading}
                            className={`h-8 px-3 text-sm ${
                              isAccepted
                                ? "bg-green-100 text-green-800 cursor-not-allowed hover:bg-green-100"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white"
                            }`}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {isAccepted ? "Accepted" : "Accept"}
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

        {/* Modal Dialog */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Dialog Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    {selectedApplicant.applicant?.profilePhoto ? (
                      <img
                        src={selectedApplicant.applicant.profilePhoto || "/placeholder.svg"}
                        alt={getApplicantDisplayName(selectedApplicant)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-medium text-slate-700">
                        {getApplicantInitials(selectedApplicant)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {getApplicantDisplayName(selectedApplicant)}
                      </h2>
                      {getStatusBadge(selectedApplicant.status || "pending")}
                    </div>
                    <div className="space-y-1">
                      {selectedApplicant.applicant?.email && (
                        <p className="text-sm text-slate-600">{selectedApplicant.applicant.email}</p>
                      )}
                      <p className="text-sm text-slate-500">Applied on {formatDate(selectedApplicant.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={closeDialog} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-transparent">
                <div className="space-y-8">
                  {/* Message Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Message</h3>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-6">
                      <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedApplicant.message}
                      </p>
                    </div>
                  </div>

                  {/* Work Section */}
                  {(selectedApplicant.bestWorkLink || selectedApplicant.bestWorkDescription) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Previous Work</h3>
                      </div>
                      <div className="space-y-6">
                        {selectedApplicant.bestWorkLink && (
                          <div>
                            <h4 className="text-base font-medium text-slate-800 mb-3">Work Link</h4>
                            <div className="bg-slate-50 rounded-lg p-6">
                              {isValidUrl(selectedApplicant.bestWorkLink) ? (
                                <a
                                  href={selectedApplicant.bestWorkLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-base font-medium transition-colors bg-white px-4 py-3 rounded-lg border border-emerald-200 hover:border-emerald-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Work
                                </a>
                              ) : (
                                <p className="text-base text-slate-700 leading-relaxed">
                                  {selectedApplicant.bestWorkLink}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedApplicant.bestWorkDescription && (
                          <div>
                            <h4 className="text-base font-medium text-slate-800 mb-3">Work Description</h4>
                            <div className="bg-slate-50 rounded-lg p-6">
                              <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
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

              {/* Dialog Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button variant="outline" onClick={closeDialog} className="text-base px-6">
                  Close
                </Button>
                <Button
                  onClick={handleDeleteApplication}
                  variant="outline"
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-700 hover:text-white text-white text-base px-6 disabled:opacity-50"
                >
                  Reject Applicant
                </Button>
                <Button
                  onClick={() => handleAccept(selectedApplicant._id, selectedApplicant.applicant.email)}
                  disabled={
                    selectedApplicant.status?.toLowerCase() === "accepted" ||
                    selectedApplicant.status?.toLowerCase() === "rejected" ||
                    loading
                  }
                  className={`text-base px-6 ${
                    selectedApplicant.status?.toLowerCase() === "accepted"
                      ? "bg-green-100 text-green-800 cursor-not-allowed hover:bg-green-100"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  {selectedApplicant.status?.toLowerCase() === "accepted" ? "Already Accepted" : "Accept Application"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Contact Dialog */}
        {contactDialogOpen && contactData && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Contact Dialog Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Contact Information</h2>
                    <p className="text-sm text-slate-500">Get in touch with the applicant</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setContactDialogOpen(false)} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Contact Dialog Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-6">
                  {/* Email Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Email</h3>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base text-slate-700">{contactData.email}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`mailto:${contactData.email}`, "_blank")}
                          className="text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Contact Links Section */}
                  {contactData.contactLinks && contactData.contactLinks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Contact Links</h3>
                      </div>
                      <div className="space-y-3">
                        {contactData.contactLinks.map((link, index) => (
                          <div key={index} className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-slate-900">{link.label}</p>
                                <p className="text-sm text-slate-500 truncate">{link.url}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(link.url, "_blank")}
                                className="text-sm flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Visit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Contact Links Message */}
                  {(!contactData.contactLinks || contactData.contactLinks.length === 0) && (
                    <div className="text-center py-8">
                      <ExternalLink className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-base font-medium text-slate-900 mb-1">No Additional Contact Links</h3>
                      <p className="text-sm text-slate-500">
                        The applicant hasn't provided any additional contact links.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Dialog Footer */}
              <div className="flex justify-end gap-3 p-6 border-b border-slate-200 bg-slate-50">
                <Button variant="outline" onClick={() => setContactDialogOpen(false)} className="text-base px-6">
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
