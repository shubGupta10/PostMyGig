"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, X, Users, MessageSquare, FileText, Eye, Check } from "lucide-react"

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
  bestWorkDescription: string
  createdAt: string
  updatedAt: string
  applicant: Applyer
}

function ViewApplication() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get("gigId")
  const [application, setApplication] = useState<Application[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const router = useRouter();

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications/fetch-applications?gigId=${applicationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (response.ok) {
        setApplication(data.data)
        console.log(data.data);
        
      } else {
        console.error("Error fetching application", data)
      }
    } catch (error) {
      console.error("Error fetching application", error)
    }
  }

  useEffect(() => {
    if (applicationId) {
      fetchApplication()
    } else {
      console.error("Application ID is required")
    }
  }, [applicationId])

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

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
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

  const getNameInitials = (name: string) => {
    const nameParts = name.trim().split(" ")
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getEmailInitials = (email: string) => {
    const name = email.split("@")[0]
    return name.substring(0, 2).toUpperCase()
  }

  const getApplicantInitials = (applicant: Application) => {
    if (applicant.applicant.name) {
      return getNameInitials(applicant.applicant.name)
    }
    if (applicant.applicant?.email) {
      return getEmailInitials(applicant.applicant.email)
    }
    return "??"
  }

  const getApplicantDisplayName = (applicant: Application) => {
    return applicant.applicant.name || applicant.applicant.email || "Unknown User"
  }


  const openDialog = (applicant: Application) => {
    setSelectedApplicant(applicant)
  }

  const closeDialog = () => {
    setSelectedApplicant(null)
  }

  const handleDeleteApplication = async () => {
    try {
      const response = await fetch("/api/applications/delete-applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({applicationId: selectedApplicant?._id})
      })
      if (response.ok) {
          alert("Application deleted successfully");
          router.back();
      } else {
          alert("Error deleting application")
      }
    } catch (error) {
      console.error("Error deleting application", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Applicants</h1>
                <p className="text-sm text-slate-500">Gig ID: {applicationId}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                {application.length} {application.length === 1 ? "Application" : "Applications"}
              </span>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {application.length === 0 ? (
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
                <div className="col-span-4">Applicant</div>
                <div className="col-span-3">Applied</div>
                <div className="col-span-2">Work</div>
                <div className="col-span-3">Actions</div>
              </div>
            </div>

            {/* Applications Rows */}
            <div className="divide-y divide-slate-100">
              {application.map((applicant, index) => (
                <div key={applicant._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Applicant Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {applicant.applicant?.profilePhoto ? (
                            <img
                              src={applicant.applicant.profilePhoto}
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
                                <p className="text-sm text-slate-500 truncate">
                                  {applicant.applicant.email}
                                </p>
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
                    <div className="col-span-3">
                      <p className="text-base font-medium text-slate-900">{formatDateShort(applicant.createdAt)}</p>
                      <p className="text-sm text-slate-500">{formatDate(applicant.createdAt)}</p>
                    </div>

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
                        <Button size="sm" className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                        src={selectedApplicant.applicant.profilePhoto}
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
                    <h2 className="text-xl font-semibold text-slate-900">
                      {getApplicantDisplayName(selectedApplicant)}
                    </h2>
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
                <Button onClick={handleDeleteApplication} variant="outline" className="bg-red-500 hover:bg-red-700 hover:text-white text-white text-base px-6">
                  Reject Applicant
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-base px-6">
                  Accept Application
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