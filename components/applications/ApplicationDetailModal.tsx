import type { Application } from "@/app/(pages)/applications/view-applications/types"
import { X, MessageSquare, Star, ExternalLink, FileText, XCircle, Check, Mail, Calendar, User2, Contact2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type React from "react"

interface Props {
  application: Application
  loading: boolean
  onClose: () => void
  onAccept: (id: string, email: string) => void
  onDelete: () => void
  onContact?: (email: string) => void
}

export function ApplicationDetailModal({
  application, loading, onClose, onAccept, onDelete, onContact,
}: Props) {

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm max-w-3xl w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              {(application.applicant?.profilePhoto || (application.applicant as any)?.image || (application.applicant as any)?.avatar) ? (
                <img
                  src={application.applicant?.profilePhoto || (application.applicant as any)?.image || (application.applicant as any)?.avatar}
                  alt={application.applicant?.name || "Applicant"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-lg">{(application.applicant?.name?.[0] || "?").toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground truncate">{application.applicant?.name || application.applicant?.email || "Applicant"}</h2>
                <Badge className="border px-2.5 py-1 capitalize font-medium">{application.status || "Pending"}</Badge>
              </div>
              {application.applicant?.email && (
                <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {application.applicant.email}
                </p>
              )}
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" /> Applied on {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
                    <a href={application.bestWorkLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                      <ExternalLink className="w-4 h-4 shrink-0" /> {application.bestWorkLink}
                    </a>
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
          <Button variant="outline" onClick={onClose} className="border-border font-semibold">Close</Button>
          <Button onClick={onDelete} variant="outline" disabled={loading}
            className="bg-destructive text-destructive-foreground border-destructive font-semibold">
            <XCircle className="w-4 h-4 mr-2" /> Reject Application
          </Button>
          {application.status === "accepted" ? (
            <>
              {onContact && (
                <Button onClick={() => onContact(application.applicant?.email || "")} className="bg-primary text-primary-foreground font-semibold">
                  <User2 className="w-4 h-4 mr-2" /> Contact
                </Button>
              )}
              <Button onClick={() => (window.location.href = `/chat/?projectId=${application.projectId}`)} className="bg-primary text-primary-foreground font-semibold">
                <Contact2 className="w-4 h-4 mr-2" /> Chat
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onAccept(application._id, application.applicant?.email || "")}
              disabled={loading}
              className="bg-primary text-primary-foreground font-semibold"
            >
              <Check className="w-4 h-4 mr-2" /> Accept Application
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
