"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, Check, Clock, XCircle, User2, Calendar, Activity, Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import type { Application, ContactData } from "@/app/(pages)/applications/view-applications/types"
import { ApplicationCard } from "@/components/applications/ApplicationCard"
import { ApplicationDetailModal } from "@/components/applications/ApplicationDetailModal"
import { ContactModal } from "@/components/applications/ContactModal"
import {
  fetchApplicationsService,
  acceptApplicationService,
  deleteApplicationService,
  fetchContactDetailsService,
} from "@/app/(pages)/applications/view-applications/services/applicationsService"

export function ApplicationsList() {
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

  useEffect(() => {
    if (session?.user?.email) {
      if (gigPosterEmail) {
        setIsAuthorized(session.user.email === gigPosterEmail)
      } else if (applications.length === 0 && !initialLoading) {
        setIsAuthorized(true)
      }
    } else if (!initialLoading) {
      setIsAuthorized(false)
    }
  }, [session, gigPosterEmail, applications.length, initialLoading])

  const fetchApplications = async () => {
    try {
      setInitialLoading(true)
      const { applications: data, posterEmail } = await fetchApplicationsService(gigIdFromSearchParams!)
      setApplications(data)
      if (posterEmail) setGigPosterEmail(posterEmail)
      else if (data.length === 0) setIsAuthorized(true)
    } catch {
      setApplications([])
      setIsAuthorized(true)
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    if (gigIdFromSearchParams) fetchApplications()
  }, [gigIdFromSearchParams])

  const filteredApplications = applications.filter((app) => {
    const name = app.applicant?.name || ""
    const email = app.applicant?.email || ""
    const msg = app.message || ""
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status?.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const map: Record<string, { icon: React.ElementType; label: string; cls: string }> = {
      pending: { icon: Clock, label: "Pending", cls: "bg-secondary text-secondary-foreground border-border" },
      accepted: { icon: Check, label: "Accepted", cls: "bg-primary text-primary-foreground border-primary" },
      rejected: { icon: XCircle, label: "Rejected", cls: "bg-destructive text-destructive-foreground border-destructive" },
    }
    const cfg = map[status.toLowerCase()] || map.pending
    const Icon = cfg.icon
    return (
      <Badge className={`${cfg.cls} border font-medium flex items-center gap-1.5 px-2.5 py-1`}>
        <Icon className="w-3 h-3" /> {cfg.label}
      </Badge>
    )
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const formatDateShort = (d: string) => {
    const date = new Date(d)
    const diff = Math.ceil(Math.abs(new Date().getTime() - date.getTime()) / 86400000)
    if (diff === 0) return "Today"
    if (diff === 1) return "Yesterday"
    if (diff <= 7) return `${diff - 1}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getApplicantInitials = (app: Application) => {
    if (app?.applicant?.name) {
      const parts = app.applicant.name.trim().split(" ")
      return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : app.applicant.name.substring(0, 2).toUpperCase()
    }
    if (app?.applicant?.email) return app.applicant.email.split("@")[0].substring(0, 2).toUpperCase()
    return "??"
  }

  const getApplicantDisplayName = (app: Application) =>
    app?.applicant?.name || app?.applicant?.email || "Unknown User"

  const handleAccept = async (applicationId: string, applicantEmail: string) => {
    setLoading(true)
    try {
      await acceptApplicationService(applicationId, applicantEmail, gigIdFromSearchParams!)
      toast.success("Applicant accepted successfully")
      await fetchApplications()
    } catch {
      toast.error("Failed to accept applicant")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApplication = async () => {
    if (!selectedApplicant) return
    setLoading(true)
    try {
      await deleteApplicationService(selectedApplicant._id)
      toast.success("Application deleted successfully")
      setSelectedApplicant(null)
      await fetchApplications()
    } catch {
      toast.error("Error deleting application")
    } finally {
      setLoading(false)
    }
  }

  const handleContactApplicant = async (applicantEmail: string) => {
    try {
      const data = await fetchContactDetailsService(applicantEmail)
      setContactData(data)
      setContactDialogOpen(true)
    } catch (error: any) {
      toast.error(error.message || "Failed to contact applicant")
    }
  }

  const acceptedCount = applications.filter(a => a.status?.toLowerCase() === "accepted").length
  const pendingCount = applications.filter(a => a.status?.toLowerCase() === "pending").length
  const rejectedCount = applications.filter(a => a.status?.toLowerCase() === "rejected").length

  // Unauthorized
  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-card rounded-2xl border-2 border-border p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-destructive text-destructive-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-6">Only the poster of this gig can access the applications.</p>
          <Button onClick={() => window.history.back()} className="bg-primary text-primary-foreground font-semibold px-8">Go Back</Button>
        </div>
      </div>
    )
  }

  // Loading / checking auth
  if (initialLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats + Header Card */}
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground mb-1">Application Management</h1>
          <p className="text-sm text-muted-foreground">
            Gig ID: <span className="font-semibold text-foreground font-mono">{gigIdFromSearchParams}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {[
            { label: "Total", value: applications.length, icon: Users },
            { label: "Pending", value: pendingCount, icon: Clock },
            { label: "Accepted", value: acceptedCount, icon: Check },
            { label: "Rejected", value: rejectedCount, icon: XCircle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center border border-border">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="p-6 sm:p-8 border-t border-border flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-card rounded-2xl border-2 border-border shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {searchTerm || statusFilter !== "all" ? "No Matching Applications" : "No Applications Yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No one has applied for this project yet."}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
          {/* Table header (desktop only) */}
          <div className="hidden lg:grid grid-cols-12 gap-6 px-6 py-4 bg-muted border-b border-border">
            {[
              { label: "Applicant", icon: User2, span: "col-span-5" },
              { label: "Applied", icon: Calendar, span: "col-span-2" },
              { label: "Status", icon: Activity, span: "col-span-2" },
              { label: "Actions", icon: null, span: "col-span-3 text-right" },
            ].map(({ label, icon: Icon, span }) => (
              <div key={label} className={`${span} flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest`}>
                {Icon && <Icon className="w-3.5 h-3.5" />} {label}
              </div>
            ))}
          </div>

          {filteredApplications.map((applicant, index) => (
            <ApplicationCard
              key={applicant._id}
              applicant={applicant}
              index={index}
              loading={loading}
              onView={setSelectedApplicant}
              onAccept={handleAccept}
              onContact={handleContactApplicant}
              getStatusBadge={getStatusBadge}
              getApplicantInitials={getApplicantInitials}
              getApplicantDisplayName={getApplicantDisplayName}
              formatDateShort={formatDateShort}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedApplicant && (
        <ApplicationDetailModal
          application={selectedApplicant}
          loading={loading}
          onClose={() => setSelectedApplicant(null)}
          onAccept={handleAccept}
          onDelete={handleDeleteApplication}
          getStatusBadge={getStatusBadge}
          getApplicantInitials={getApplicantInitials}
          getApplicantDisplayName={getApplicantDisplayName}
          formatDate={formatDate}
        />
      )}

      {/* Contact Modal */}
      {contactDialogOpen && contactData && (
        <ContactModal contactData={contactData} onClose={() => setContactDialogOpen(false)} />
      )}
    </div>
  )
}
