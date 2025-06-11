"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, X, Users, MessageSquare, FileText, Eye, Check, Clock, XCircle, User2, Mail, Calendar, Star, Award, Activity, Search, Shield, AlertTriangle, Contact2 } from 'lucide-react'
import { toast } from "sonner"
import { useSession } from "next-auth/react"

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
  const { data: session } = useSession()

  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [gigPosterEmail, setGigPosterEmail] = useState<string | null>(null)

  // Check authorization
  useEffect(() => {
    if (session?.user?.email) {
      if (gigPosterEmail) {
        // We have poster email from applications
        setIsAuthorized(session.user.email === gigPosterEmail)
      } else if (applications.length === 0 && !initialLoading) {
        // No applications and not loading, assume authorized
        // In a real app, you might want to fetch gig details to verify
        setIsAuthorized(true)
      }
    } else if (!initialLoading) {
      // No session and not loading
      setIsAuthorized(false)
    }
  }, [session, gigPosterEmail, applications.length, initialLoading])

  const fetchApplications = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch(`/api/applications/fetch-applications?gigId=${gigIdFromSearchParams}`)
      const data = await response.json()

      if (response.ok) {
        if (data.data && Array.isArray(data.data)) {
          setApplications(data.data)
          if (data.data.length > 0) {
            setGigPosterEmail(data.data[0].posterEmail)
          }
        } else if (data.error === "No applications found for this gig") {
          setApplications([])
          // We don't have poster email from applications, so we'll need to handle this
          // For now, we'll assume the user is authorized if they can access this page
          setIsAuthorized(true)
        } else {
          setApplications(data.data || [])
        }
      } else {
        console.error("Error fetching applications", data)
        setApplications([])
        setIsAuthorized(true)
      }
    } catch (error) {
      console.error("Error fetching applications", error)
      setApplications([])
      setIsAuthorized(true)
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    if (gigIdFromSearchParams) {
      fetchApplications()
    } else {
      console.error("Gig ID is required")
    }
  }, [gigIdFromSearchParams])

  const filteredApplications = (applications || []).filter((app) => {
    // Add null checks for applicant and its properties
    const applicantName = app.applicant?.name || ""
    const applicantEmail = app.applicant?.email || ""
    const message = app.message || ""

    const matchesSearch =
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status?.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  // Show unauthorized message if user is not authorized
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/20 via-background to-secondary/30 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl border border-destructive/30 p-8 md:p-12 max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-destructive to-destructive/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-destructive-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">Access Denied</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            You are not allowed to view this application. Only the poster of this gig can access the applications.
          </p>
          <div className="bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-xl p-6 border border-destructive/30 mb-8">
            <div className="flex items-center justify-center gap-3 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold text-lg">Unauthorized Access Attempt</span>
            </div>
          </div>
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium shadow-lg"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Show loading state while initially fetching
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-accent/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    )
  }

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-accent/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    )
  }

  // Status badge configuration
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-gradient-to-r from-secondary to-accent text-accent-foreground border-secondary",
        icon: Clock,
        text: "Pending",
      },
      accepted: {
        color: "bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-primary/30",
        icon: Check,
        text: "Accepted",
      },
      rejected: {
        color: "bg-gradient-to-r from-destructive/20 to-destructive/30 text-destructive border-destructive/30",
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
    // Add null checks for applicant and its properties
    if (applicant?.applicant?.name) {
      const nameParts = applicant.applicant.name.trim().split(" ")
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      }
      return applicant.applicant.name.substring(0, 2).toUpperCase()
    }
    if (applicant?.applicant?.email) {
      const name = applicant.applicant.email.split("@")[0]
      return name.substring(0, 2).toUpperCase()
    }
    return "??"
  }

  const getApplicantDisplayName = (applicant: Application) => {
    // Add null checks for applicant and its properties
    return applicant?.applicant?.name || applicant?.applicant?.email || "Unknown User"
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
        toast.error("Failed to accept applicant")
        return
      }

      toast.success("Applicant accepted successfully")
      await fetchApplications()
    } catch (error) {
      console.error("Error accepting applicant:", error)
      toast.error("Something went wrong")
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
        toast.success("Application deleted successfully")
        closeDialog()
        await fetchApplications()
      } else {
        toast.error("Error deleting application")
      }
    } catch (error) {
      console.error("Error deleting application", error)
      toast.error("Something went wrong")
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

      setContactData({
        email: ApplicantData.contactDetails.email,
        contactLinks: ApplicantData.contactDetails.contactLinks || [],
      })
      setContactDialogOpen(true)
    } catch (error) {
      console.error("Error contacting applicant:", error)
      toast.error("Failed to contact applicant. Please try again later.")
    }
  }

  const acceptedCount = (applications || []).filter((app) => app.status?.toLowerCase() === "accepted").length
  const pendingCount = (applications || []).filter((app) => app.status?.toLowerCase() === "pending").length
  const rejectedCount = (applications || []).filter((app) => app.status?.toLowerCase() === "rejected").length

  return (
    <div className="min-h-screen bg-background to-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Enhanced Header - Fully Responsive */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col space-y-6">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-primary rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">Application Management</h1>
                <p className="text-muted-foreground text-base sm:text-lg break-all sm:break-normal">
                  Gig ID: <span className="font-semibold text-primary">{gigIdFromSearchParams}</span>
                </p>
              </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-secondary/50 to-accent/50 rounded-xl p-3 sm:p-4 border border-border">
                <div className="text-xl sm:text-2xl font-bold text-accent-foreground">{applications.length}</div>
                <div className="text-xs sm:text-sm text-accent-foreground font-medium">Total</div>
              </div>
              <div className="bg-gradient-to-br from-secondary to-accent rounded-xl p-3 sm:p-4 border border-border">
                <div className="text-xl sm:text-2xl font-bold text-accent-foreground">{pendingCount}</div>
                <div className="text-xs sm:text-sm text-accent-foreground font-medium">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl p-3 sm:p-4 border border-primary/30">
                <div className="text-xl sm:text-2xl font-bold text-primary">{acceptedCount}</div>
                <div className="text-xs sm:text-sm text-primary font-medium">Accepted</div>
              </div>
              <div className="bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-xl p-3 sm:p-4 border border-destructive/30">
                <div className="text-xl sm:text-2xl font-bold text-destructive">{rejectedCount}</div>
                <div className="text-xs sm:text-sm text-destructive font-medium">Rejected</div>
              </div>
            </div>

            {/* Search and Filter Bar - Responsive */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base bg-background"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 sm:py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base bg-background min-w-0 sm:min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List - Responsive */}
        {filteredApplications.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-muted to-muted/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
              {searchTerm || statusFilter !== "all" ? "No Matching Applications" : "No Applications Yet"}
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No one has applied for this project yet. Share your gig to attract talented applicants!"}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-muted to-muted/80 px-8 py-6 border-b border-border">
                <div className="grid grid-cols-12 gap-6 items-center text-sm font-semibold text-muted-foreground uppercase tracking-wide">
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
                  <div className="col-span-4 text-center">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {filteredApplications.map((applicant, index) => {
                  const isAccepted = applicant.status?.toLowerCase() === "accepted"
                  const isRejected = applicant.status?.toLowerCase() === "rejected"

                  return (
                    <div
                      key={applicant._id}
                      className="px-8 py-6 hover:bg-gradient-to-r hover:from-secondary/30 hover:to-accent/30 transition-all duration-200 group"
                    >
                      <div className="grid grid-cols-12 gap-6 items-center">
                        <div className="col-span-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-200">
                                {applicant.applicant?.profilePhoto ? (
                                  <img
                                    src={applicant.applicant.profilePhoto || "/placeholder.svg"}
                                    alt={getApplicantDisplayName(applicant)}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-primary-foreground font-bold text-lg">
                                    {getApplicantInitials(applicant)}
                                  </span>
                                )}
                              </div>
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg">
                                {index + 1}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold text-card-foreground truncate group-hover:text-primary transition-colors duration-200">
                                {getApplicantDisplayName(applicant)}
                              </h3>
                              {applicant.applicant?.name && applicant.applicant?.email && (
                                <p className="text-muted-foreground truncate flex items-center gap-2 mt-1">
                                  <Mail className="w-4 h-4" />
                                  {applicant.applicant.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-card-foreground">
                              {formatDateShort(applicant.createdAt)}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(applicant.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-2">{getStatusBadge(applicant.status || "pending")}</div>

                        <div className="col-span-4">
                          <div className="flex items-center gap-3 justify-center flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog(applicant)}
                              className="border-border text-primary hover:bg-secondary hover:border-primary font-medium"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {applicant.status?.toLowerCase() === "accepted" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleContactApplicant(applicant.applicant?.email || "")}
                                  className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-medium shadow-lg"
                                >
                                  <User2 className="w-4 h-4 mr-1" />
                                  Contact
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={() => (window.location.href = `/chat/?projectId=${applicant.projectId}`)}
                                  className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-medium shadow-lg"
                                >
                                  <Contact2 className="w-4 h-4 mr-1" />
                                  Chat With User
                                </Button>
                              </>
                            )}
                            <Button
                              onClick={() => handleAccept(applicant._id, applicant.applicant?.email || "")}
                              size="sm"
                              disabled={isAccepted || isRejected || loading}
                              className={`font-medium shadow-lg ${isAccepted
                                  ? "bg-primary/20 text-primary cursor-not-allowed hover:bg-primary/20"
                                  : "bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground"
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

            {/* Mobile Card View - Visible on Mobile/Tablet */}
            <div className="lg:hidden divide-y divide-border">
              {filteredApplications.map((applicant, index) => {
                const isAccepted = applicant.status?.toLowerCase() === "accepted"
                const isRejected = applicant.status?.toLowerCase() === "rejected"

                return (
                  <div key={applicant._id} className="p-4 sm:p-6 hover:bg-muted/30 transition-colors duration-200">
                    <div className="space-y-4">
                      {/* Applicant Info */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
                            {applicant.applicant?.profilePhoto ? (
                              <img
                                src={applicant.applicant.profilePhoto || "/placeholder.svg"}
                                alt={getApplicantDisplayName(applicant)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                                {getApplicantInitials(applicant)}
                              </span>
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-primary to-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-card-foreground truncate">
                            {getApplicantDisplayName(applicant)}
                          </h3>
                          {applicant.applicant?.name && applicant.applicant?.email && (
                            <p className="text-muted-foreground truncate flex items-center gap-2 mt-1 text-sm">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                              {applicant.applicant.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          {getStatusBadge(applicant.status || "pending")}
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateShort(applicant.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(applicant)}
                          className="border-border text-primary hover:bg-secondary hover:border-primary font-medium flex-1 sm:flex-none"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {applicant.status?.toLowerCase() === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() => handleContactApplicant(applicant.applicant.email)}
                            className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-medium shadow-lg flex-1 sm:flex-none"
                          >
                            <User2 className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        )}
                        <Button
                          onClick={() => handleAccept(applicant._id, applicant.applicant.email)}
                          size="sm"
                          disabled={isAccepted || isRejected || loading}
                          className={`font-medium shadow-lg flex-1 sm:flex-none ${isAccepted
                              ? "bg-primary/20 text-primary cursor-not-allowed hover:bg-primary/20"
                              : "bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground"
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
                )
              })}
            </div>
          </div>
        )}

        {/* Enhanced Modal Dialog - Responsive */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
              {/* Enhanced Dialog Header - Responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-border bg-gradient-to-r from-secondary/50 to-accent/50 gap-4">
                <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                    {selectedApplicant.applicant?.profilePhoto ? (
                      <img
                        src={selectedApplicant.applicant.profilePhoto || "/placeholder.svg"}
                        alt={getApplicantDisplayName(selectedApplicant)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-foreground font-bold text-lg sm:text-xl">
                        {getApplicantInitials(selectedApplicant)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-card-foreground truncate">
                        {getApplicantDisplayName(selectedApplicant)}
                      </h2>
                      {getStatusBadge(selectedApplicant.status || "pending")}
                    </div>
                    <div className="space-y-1">
                      {selectedApplicant.applicant?.email && (
                        <p className="text-muted-foreground flex items-center gap-2 text-sm sm:text-base break-all sm:break-normal">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          {selectedApplicant.applicant.email}
                        </p>
                      )}
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        Applied on {formatDate(selectedApplicant.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeDialog}
                  className="h-10 w-10 p-0 border-border hover:bg-muted flex-shrink-0 self-start sm:self-center"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Enhanced Dialog Content - Responsive */}
              <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-240px)]">
                <div className="space-y-6 sm:space-y-8">
                  {/* Enhanced Message Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-card-foreground">Application Message</h3>
                    </div>
                    <div className="bg-gradient-to-br from-muted to-muted/80 rounded-xl p-4 sm:p-6 border border-border">
                      <p className="text-card-foreground leading-relaxed text-base sm:text-lg whitespace-pre-wrap break-words">
                        {selectedApplicant.message}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Work Section */}
                  {(selectedApplicant.bestWorkLink || selectedApplicant.bestWorkDescription) && (
                    <div>
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-card-foreground">Portfolio & Previous Work</h3>
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        {selectedApplicant.bestWorkLink && (
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-card-foreground mb-3 sm:mb-4 flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              Work Link
                            </h4>
                            <div className="bg-gradient-to-br from-secondary/50 to-accent/50 rounded-xl p-4 sm:p-6 border border-border">
                              {isValidUrl(selectedApplicant.bestWorkLink) ? (
                                <a
                                  href={selectedApplicant.bestWorkLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-3 text-primary hover:text-primary/90 text-base sm:text-lg font-semibold transition-colors bg-card px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-border hover:border-primary shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 break-all"
                                >
                                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                  View Portfolio
                                </a>
                              ) : (
                                <p className="text-card-foreground leading-relaxed text-base sm:text-lg break-words">
                                  {selectedApplicant.bestWorkLink}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedApplicant.bestWorkDescription && (
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-card-foreground mb-3 sm:mb-4 flex items-center gap-2">
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              Work Description
                            </h4>
                            <div className="bg-gradient-to-br from-secondary/50 to-accent/50 rounded-xl p-4 sm:p-6 border border-border">
                              <p className="text-card-foreground leading-relaxed text-base sm:text-lg whitespace-pre-wrap break-words">
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

              {/* Enhanced Dialog Footer - Responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 border-t border-border bg-gradient-to-r from-muted/50 to-muted/80">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  className="px-6 sm:px-8 py-2 sm:py-3 font-medium order-3 sm:order-1"
                >
                  Close
                </Button>
                <Button
                  onClick={handleDeleteApplication}
                  variant="outline"
                  disabled={loading}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive hover:border-destructive px-6 sm:px-8 py-2 sm:py-3 font-medium disabled:opacity-50 order-2"
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
                  className={`px-6 sm:px-8 py-2 sm:py-3 font-medium order-1 sm:order-3 ${selectedApplicant.status?.toLowerCase() === "accepted"
                      ? "bg-primary/20 text-primary cursor-not-allowed hover:bg-primary/20"
                      : "bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground"
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

        {/* Enhanced Contact Dialog - Responsive */}
        {contactDialogOpen && contactData && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border">
              {/* Enhanced Contact Dialog Header - Responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-border bg-gradient-to-r from-secondary/50 to-accent/50 gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <User2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">Contact Information</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">Connect with the accepted applicant</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContactDialogOpen(false)}
                  className="h-10 w-10 p-0 border-border hover:bg-muted flex-shrink-0 self-start sm:self-center"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Enhanced Contact Dialog Content - Responsive */}
              <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-240px)]">
                <div className="space-y-6 sm:space-y-8">
                  {/* Enhanced Email Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-card-foreground">Email Address</h3>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/50 to-accent/50 rounded-xl p-4 sm:p-6 border border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-base sm:text-lg text-card-foreground font-medium break-all">
                          {contactData.email}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => window.open(`mailto:${contactData.email}`, "_blank")}
                          className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-medium shadow-lg flex-shrink-0"
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
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-card-foreground">
                          Additional Contact Methods
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {contactData.contactLinks.map((link, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-secondary/50 to-accent/50 rounded-xl p-4 sm:p-6 border border-border"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-card-foreground text-base sm:text-lg">{link.label}</p>
                                <p className="text-muted-foreground break-all mt-1 text-sm sm:text-base">{link.url}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => window.open(link.url, "_blank")}
                                className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-medium shadow-lg flex-shrink-0"
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
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-muted to-muted/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-3">
                        No Additional Contact Methods
                      </h3>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        The applicant hasn't provided any additional contact links. You can reach them via email.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Contact Dialog Footer - Responsive */}
              <div className="flex justify-end gap-4 p-4 sm:p-6 lg:p-8 border-t border-border bg-gradient-to-r from-muted/50 to-muted/80">
                <Button
                  variant="outline"
                  onClick={() => setContactDialogOpen(false)}
                  className="px-6 sm:px-8 py-2 sm:py-3 font-medium"
                >
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