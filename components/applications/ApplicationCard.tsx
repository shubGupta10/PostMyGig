import type { Application } from "@/app/(pages)/applications/view-applications/types"
import { Mail, Eye, Check, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  applicant: Application
  index: number
  loading: boolean
  onView: (app: Application) => void
  onAccept: (id: string, email: string) => void
  onContact: (email: string) => void
}

export function ApplicationCard({
  applicant, index, loading, onView, onAccept, onContact,
}: Props) {

  return (
    <div className="p-5 sm:p-6 border-b border-border last:border-b-0">
      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
        {/* Applicant */}
        <div className="col-span-6 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              {(applicant.applicant?.profilePhoto || (applicant.applicant as any)?.image || (applicant.applicant as any)?.avatar) ? (
                <img
                  src={applicant.applicant?.profilePhoto || (applicant.applicant as any)?.image || (applicant.applicant as any)?.avatar}
                  alt={applicant.applicant?.name || "Applicant"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold">{(applicant.applicant?.name?.[0] || "?").toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted border border-border rounded-full flex items-center justify-center text-foreground text-xs font-bold">
              {index + 1}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground truncate">{applicant.applicant?.name || applicant.applicant?.email || "Applicant"}</p>
            {applicant.applicant?.email && (
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {applicant.applicant.email}
              </p>
            )}
          </div>
        </div>
        {/* Date */}
        <div className="col-span-3">
          <p className="font-bold text-foreground text-sm flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {new Date(applicant.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        {/* Actions */}
        <div className="col-span-3 flex items-center gap-2 flex-wrap justify-end">
          <Button size="sm" variant="outline" onClick={() => onView(applicant)} className="border-border font-semibold">
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          {applicant.status !== "accepted" && (
            <Button
              size="sm"
              onClick={() => onAccept(applicant._id, applicant.applicant?.email || "")}
              disabled={loading}
              className="bg-primary text-primary-foreground font-semibold disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-1" /> Accept
            </Button>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 bg-primary text-primary-foreground rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              {(applicant.applicant?.profilePhoto || (applicant.applicant as any)?.image || (applicant.applicant as any)?.avatar) ? (
                <img
                  src={applicant.applicant?.profilePhoto || (applicant.applicant as any)?.image || (applicant.applicant as any)?.avatar}
                  alt={applicant.applicant?.name || "Applicant"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-sm">{(applicant.applicant?.name?.[0] || "?").toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-muted border border-border rounded-full flex items-center justify-center text-foreground text-xs font-bold">
              {index + 1}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-foreground truncate">{applicant.applicant?.name || applicant.applicant?.email || "Applicant"}</p>
            {applicant.applicant?.email && (
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 shrink-0" /> {applicant.applicant.email}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Applied {new Date(applicant.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(applicant)} className="border-border font-semibold flex-1">
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          {applicant.status !== "accepted" && (
            <Button
              size="sm"
              onClick={() => onAccept(applicant._id, applicant.applicant.email)}
              disabled={loading}
              className="bg-primary text-primary-foreground font-semibold flex-1 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-1" /> Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
