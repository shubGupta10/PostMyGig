import type { Application } from "@/app/(pages)/applications/view-applications/types"
import { X, MessageSquare, Star, ExternalLink, FileText, XCircle, Check, Award, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  application: Application
  loading: boolean
  onClose: () => void
  onAccept: (id: string, email: string) => void
  onDelete: () => void
  getStatusBadge: (status: string) => React.ReactNode
  getApplicantInitials: (app: Application) => string
  getApplicantDisplayName: (app: Application) => string
  formatDate: (d: string) => string
}

function isValidUrl(s: string) {
  try { new URL(s); return true } catch { return false }
}

export function ApplicationDetailModal({
  application, loading, onClose, onAccept, onDelete,
  getStatusBadge, getApplicantInitials, getApplicantDisplayName, formatDate,
}: Props) {
  const isAccepted = application.status?.toLowerCase() === "accepted"
  const isRejected = application.status?.toLowerCase() === "rejected"

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm max-w-3xl w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              {application.applicant?.profilePhoto ? (
                <img src={application.applicant.profilePhoto} alt={getApplicantDisplayName(application)} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-lg">{getApplicantInitials(application)}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground truncate">{getApplicantDisplayName(application)}</h2>
                {getStatusBadge(application.status || "pending")}
              </div>
              {application.applicant?.email && (
                <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {application.applicant.email}
                </p>
              )}
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" /> Applied on {formatDate(application.createdAt)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="h-9 w-9 p-0 border-border shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)] space-y-6">
          {/* Message */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Application Message
            </p>
            <div className="bg-muted rounded-xl p-5 border border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{application.message}</p>
            </div>
          </div>

          {/* Portfolio */}
          {(application.bestWorkLink || application.bestWorkDescription) && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5" /> Portfolio & Previous Work
              </p>
              <div className="space-y-4">
                {application.bestWorkLink && (
                  <div className="bg-muted rounded-xl p-5 border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Work Link
                    </p>
                    {isValidUrl(application.bestWorkLink) ? (
                      <a href={application.bestWorkLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                        <ExternalLink className="w-4 h-4 shrink-0" /> View Portfolio
                      </a>
                    ) : (
                      <p className="text-foreground break-words">{application.bestWorkLink}</p>
                    )}
                  </div>
                )}
                {application.bestWorkDescription && (
                  <div className="bg-muted rounded-xl p-5 border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Work Description
                    </p>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{application.bestWorkDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="border-border font-medium">Close</Button>
          <Button onClick={onDelete} variant="outline" disabled={loading}
            className="bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 font-medium">
            <XCircle className="w-4 h-4 mr-2" /> Reject Application
          </Button>
          <Button
            onClick={() => onAccept(application._id, application.applicant.email)}
            disabled={isAccepted || isRejected || loading}
            className="bg-primary text-primary-foreground font-medium"
          >
            {isAccepted ? <><Award className="w-4 h-4 mr-2" /> Already Accepted</> : <><Check className="w-4 h-4 mr-2" /> Accept Application</>}
          </Button>
        </div>

      </div>
    </div>
  )
}
