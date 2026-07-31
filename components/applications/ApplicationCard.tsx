import type { Application } from "@/app/(pages)/applications/view-applications/types"
import { Mail, Eye, Check, Award, Calendar, User2, Contact2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  applicant: Application
  index: number
  loading: boolean
  onView: (app: Application) => void
  onAccept: (id: string, email: string) => void
  onContact: (email: string) => void
  getStatusBadge: (status: string) => React.ReactNode
  getApplicantInitials: (app: Application) => string
  getApplicantDisplayName: (app: Application) => string
  formatDateShort: (d: string) => string
  formatDate: (d: string) => string
}

export function ApplicationCard({
  applicant, index, loading, onView, onAccept, onContact,
  getStatusBadge, getApplicantInitials, getApplicantDisplayName, formatDateShort, formatDate,
}: Props) {
  const isAccepted = applicant.status?.toLowerCase() === "accepted"
  const isRejected = applicant.status?.toLowerCase() === "rejected"

  return (
    <div className="p-5 sm:p-6 border-b border-border last:border-b-0">
      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
        {/* Applicant */}
        <div className="col-span-5 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center overflow-hidden">
              {applicant.applicant?.profilePhoto ? (
                <img src={applicant.applicant.profilePhoto} alt={getApplicantDisplayName(applicant)} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold">{getApplicantInitials(applicant)}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted border border-border rounded-full flex items-center justify-center text-foreground text-xs font-bold">
              {index + 1}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground truncate">{getApplicantDisplayName(applicant)}</p>
            {applicant.applicant?.email && (
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {applicant.applicant.email}
              </p>
            )}
          </div>
        </div>
        {/* Date */}
        <div className="col-span-2">
          <p className="font-bold text-foreground text-sm">{formatDateShort(applicant.createdAt)}</p>
          <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" /> {formatDate(applicant.createdAt)}
          </p>
        </div>
        {/* Status */}
        <div className="col-span-2">{getStatusBadge(applicant.status || "pending")}</div>
        {/* Actions */}
        <div className="col-span-3 flex items-center gap-2 flex-wrap justify-end">
          <Button size="sm" variant="outline" onClick={() => onView(applicant)} className="border-border font-medium">
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          {isAccepted && (
            <>
              <Button size="sm" onClick={() => onContact(applicant.applicant?.email || "")} className="bg-primary text-primary-foreground font-medium">
                <User2 className="w-4 h-4 mr-1" /> Contact
              </Button>
              <Button size="sm" onClick={() => (window.location.href = `/chat/?projectId=${applicant.projectId}`)} className="bg-primary text-primary-foreground font-medium">
                <Contact2 className="w-4 h-4 mr-1" /> Chat
              </Button>
            </>
          )}
          <Button size="sm" onClick={() => onAccept(applicant._id, applicant.applicant?.email || "")}
            disabled={isAccepted || isRejected || loading}
            className="bg-primary text-primary-foreground font-medium disabled:opacity-50">
            {isAccepted ? <><Award className="w-4 h-4 mr-1" /> Accepted</> : <><Check className="w-4 h-4 mr-1" /> Accept</>}
          </Button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 bg-primary text-primary-foreground rounded-xl flex items-center justify-center overflow-hidden">
              {applicant.applicant?.profilePhoto ? (
                <img src={applicant.applicant.profilePhoto} alt={getApplicantDisplayName(applicant)} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-sm">{getApplicantInitials(applicant)}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-muted border border-border rounded-full flex items-center justify-center text-foreground text-xs font-bold">
              {index + 1}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-foreground truncate">{getApplicantDisplayName(applicant)}</p>
            {applicant.applicant?.email && (
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 shrink-0" /> {applicant.applicant.email}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(applicant.status || "pending")}
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDateShort(applicant.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(applicant)} className="border-border font-medium flex-1">
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          {isAccepted && (
            <Button size="sm" onClick={() => onContact(applicant.applicant.email)} className="bg-primary text-primary-foreground font-medium flex-1">
              <User2 className="w-4 h-4 mr-1" /> Contact
            </Button>
          )}
          <Button size="sm" onClick={() => onAccept(applicant._id, applicant.applicant.email)}
            disabled={isAccepted || isRejected || loading}
            className="bg-primary text-primary-foreground font-medium flex-1 disabled:opacity-50">
            {isAccepted ? <><Award className="w-4 h-4 mr-1" /> Accepted</> : <><Check className="w-4 h-4 mr-1" /> Accept</>}
          </Button>
        </div>
      </div>
    </div>
  )
}
