"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { toast } from "sonner"
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

  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactData, setContactData] = useState<ContactData | null>(null)

  const fetchApplications = async () => {
    try {
      const { applications: data } = await fetchApplicationsService(gigIdFromSearchParams!)
      setApplications(data)
    } catch {
      setApplications([])
    }
  }

  useEffect(() => {
    if (gigIdFromSearchParams) fetchApplications()
  }, [gigIdFromSearchParams])

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



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Application Management</h1>
        <p className="text-sm text-muted-foreground">
          Gig ID: <span className="font-semibold text-foreground font-mono">{gigIdFromSearchParams}</span>
        </p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-muted rounded-xl p-10 text-center border border-border">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-foreground font-semibold">No Applications Yet</h3>
          <p className="text-muted-foreground text-sm mt-1">No one has applied for this project yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((applicant, index) => (
            <div key={applicant._id} className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <ApplicationCard
                applicant={applicant}
                index={index}
                loading={loading}
                onView={setSelectedApplicant}
                onAccept={handleAccept}
                onContact={handleContactApplicant}
              />
            </div>
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
          onContact={handleContactApplicant}
        />
      )}

      {/* Contact Modal */}
      {contactDialogOpen && contactData && (
        <ContactModal contactData={contactData} onClose={() => setContactDialogOpen(false)} />
      )}
    </div>
  )
}
