"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { toast } from "sonner"
import type { Application, ContactData, GigDetails } from "@/app/(pages)/applications/view-applications/types"
import { ApplicationCard } from "@/modules/applications/components/ApplicationCard"
import { TopRecommendedDeck } from "@/modules/applications/components/TopRecommendedDeck"
import { ApplicationDetailModal } from "@/modules/applications/components/ApplicationDetailModal"
import { ContactModal } from "@/modules/applications/components/ContactModal"
import {
  fetchApplicationsService,
  acceptApplicationService,
  deleteApplicationService,
  fetchContactDetailsService,
  revokeApplicationService,
} from "@/app/(pages)/applications/view-applications/services/applicationsService"

export function ApplicationsList() {
  const searchParams = useSearchParams()
  const gigIdFromSearchParams = searchParams.get("gigId")

  const [recommendedApplications, setRecommendedApplications] = useState<Application[]>([])
  const [restApplications, setRestApplications] = useState<Application[]>([])
  const [gigDetails, setGigDetails] = useState<GigDetails | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactData, setContactData] = useState<ContactData | null>(null)

  const fetchApplications = async () => {
    if (!gigIdFromSearchParams) return
    try {
      const {
        recommendedApplications: recData,
        restApplications: restData,
        gigDetails: details,
      } = await fetchApplicationsService(gigIdFromSearchParams)

      setRecommendedApplications(recData || [])
      setRestApplications(restData || [])
      if (details) setGigDetails(details)
    } catch {
      setRecommendedApplications([])
      setRestApplications([])
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
      if (selectedApplicant && selectedApplicant._id === applicationId) {
        setSelectedApplicant((prev) => (prev ? { ...prev, status: "accepted" } : null))
      }
    } catch {
      toast.error("Failed to accept applicant")
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async () => {
    setLoading(true)
    try {
      await revokeApplicationService(gigIdFromSearchParams!)
      toast.success("Acceptance revoked successfully")
      await fetchApplications()
      setSelectedApplicant(null)
    } catch {
      toast.error("Failed to revoke application")
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

  const totalCount = recommendedApplications.length + restApplications.length

  return (
    <div className="w-full space-y-14 sm:space-y-16 pb-28">


      {/* SECTION 1: Top Recommended Applications (from backend) */}
      {recommendedApplications.length > 0 && (
        <section className="space-y-5">
          <TopRecommendedDeck
            topApplicants={recommendedApplications}
            loading={loading}
            onView={setSelectedApplicant}
            onAccept={handleAccept}
          />
        </section>
      )}

      {/* SECTION 2: Applications (Rest of the applications) */}
      <section className="space-y-6 pt-12 sm:pt-16 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Applications ({restApplications.length})
          </h2>
        </div>

        {totalCount === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center border-2 border-border space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-foreground font-bold text-lg">No Applications Yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              No freelancers have submitted proposals for this gig yet.
            </p>
          </div>
        ) : restApplications.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border-2 border-border space-y-2">
            <p className="text-muted-foreground text-sm">
              All proposals for this gig are featured under <strong>Top Recommendations</strong> above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {restApplications.map((applicant, index) => (
              <div
                key={applicant._id}
                className="bg-card rounded-2xl border-2 border-border shadow-xs overflow-hidden hover:border-primary/40 transition-colors"
              >
                <ApplicationCard
                  applicant={applicant}
                  index={recommendedApplications.length + index}
                  loading={loading}
                  onView={setSelectedApplicant}
                  onAccept={handleAccept}
                  onContact={handleContactApplicant}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedApplicant && (
        <ApplicationDetailModal
          application={selectedApplicant}
          loading={loading}
          onClose={() => setSelectedApplicant(null)}
          onAccept={handleAccept}
          onDelete={handleDeleteApplication}
          onContact={handleContactApplicant}
          onRevoke={handleRevoke}
        />
      )}

      {/* Contact Modal */}
      {contactDialogOpen && contactData && (
        <ContactModal contactData={contactData} onClose={() => setContactDialogOpen(false)} />
      )}
    </div>
  )
}
