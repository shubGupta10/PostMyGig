import type { Application } from "@/app/(pages)/applications/view-applications/types"
import { Mail, Eye, Check, Calendar, Sparkles, CheckCircle2 } from "lucide-react"
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
  applicant,
  index,
  loading,
  onView,
  onAccept,
}: Props) {
  const match = applicant.matchDetails
  const isAccepted = ["accepted", "contract_offered", "in_progress"].includes(applicant.status.toLowerCase())

  return (
    <div className={`p-5 sm:p-6 transition-colors ${isAccepted ? "bg-primary" : "bg-card"}`}>
      {/* Main Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Avatar & Identity & Skills */}
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center overflow-hidden font-bold text-lg ${isAccepted ? 'bg-primary-foreground text-primary border-primary-foreground' : 'bg-primary text-primary-foreground border-primary'}`}>
              {applicant.applicant?.profilePhoto ? (
                <img
                  src={applicant.applicant.profilePhoto}
                  alt={applicant.applicant?.name || "Applicant"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{(applicant.applicant?.name?.[0] || "?").toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-background border border-border rounded-full flex items-center justify-center text-foreground text-xs font-bold shadow-xs">
              {index + 1}
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className={`font-bold text-base sm:text-lg truncate ${isAccepted ? 'text-primary-foreground' : 'text-foreground'}`}>
                {applicant.applicant?.name || applicant.userEmail}
              </h3>
              {isAccepted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Accepted
                </span>
              )}
              {match && match.score > 0 && (
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${match.score >= 70
                  ? (isAccepted ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground")
                  : match.score >= 40
                    ? (isAccepted ? "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30" : "bg-primary/15 text-primary border border-primary/30")
                    : (isAccepted ? "bg-primary-foreground/10 text-primary-foreground/80 border border-primary-foreground/20" : "bg-muted text-muted-foreground border border-border")
                  }`}>
                  <Sparkles className="w-3 h-3" /> {match.score}% Match
                </span>
              )}
            </div>

            <div className={`flex items-center gap-4 text-xs sm:text-sm flex-wrap ${isAccepted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-70" /> {applicant.applicant?.email || applicant.userEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0 opacity-70" /> Applied {new Date(applicant.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            {/* Matching Skills Pills */}
            {match?.matchingSkills && match.matchingSkills.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {match.matchingSkills.map((skill, sIdx) => (
                  <span key={sIdx} className={`text-xs font-medium px-2 py-0.5 rounded-md ${isAccepted ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2.5 self-end lg:self-center w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
          <Button
            size="sm"
            variant={isAccepted ? "ghost" : "outline"}
            onClick={() => onView(applicant)}
            className={`flex-1 lg:flex-none h-10 px-4 rounded-xl font-semibold text-sm cursor-pointer ${isAccepted ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-transparent' : 'border-2 border-border hover:bg-muted'}`}
          >
            <Eye className="w-4 h-4 mr-1.5" /> View Details
          </Button>
          {!isAccepted && (
            <Button
              size="sm"
              onClick={() => onAccept(applicant._id, applicant.applicant?.email || applicant.userEmail)}
              disabled={loading}
              className="flex-1 lg:flex-none h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-1.5" /> Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
