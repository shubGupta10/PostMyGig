import type { Application } from "@/app/(pages)/applications/view-applications/types"
import { Sparkles, Check, Eye, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  topApplicants: Application[]
  loading: boolean
  onView: (app: Application) => void
  onAccept: (id: string, email: string) => void
}

export function TopRecommendedDeck({
  topApplicants,
  loading,
  onView,
  onAccept,
}: Props) {
  if (!topApplicants || topApplicants.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Top Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Top matching candidates based on your required skills and portfolio.
          </p>
        </div>
      </div>

      {/* Grid of Clean, Non-Cluttered Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topApplicants.map((applicant) => {
          const match = applicant.matchDetails
          const isAccepted = applicant.status === "accepted"

          return (
            <div
              key={applicant._id}
              className="bg-card rounded-2xl border-2 border-border p-5 space-y-4 relative flex flex-col justify-between hover:border-primary/50 transition-colors shadow-xs"
            >
              {/* Profile Header & Match Badge */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center font-bold text-base overflow-hidden shrink-0">
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
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground text-base truncate">
                        {applicant.applicant?.name || applicant.userEmail}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {applicant.applicant?.email || applicant.userEmail}
                      </p>
                    </div>
                  </div>

                  {match && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shrink-0 shadow-xs">
                      <Sparkles className="w-3 h-3" /> {match.score}%
                    </span>
                  )}
                </div>

                {/* Matching Skills Chips */}
                {match?.matchingSkills && match.matchingSkills.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {match.matchingSkills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(applicant)}
                  className="flex-1 h-10 rounded-xl border-2 border-border font-semibold text-xs sm:text-sm hover:bg-muted cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                </Button>
                {!isAccepted ? (
                  <Button
                    size="sm"
                    onClick={() => onAccept(applicant._id, applicant.applicant?.email || applicant.userEmail)}
                    disabled={loading}
                    className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Accept
                  </Button>
                ) : (
                  <span className="flex-1 text-center py-2 text-xs font-bold text-green-500 bg-green-500/10 rounded-xl border border-green-500/20 inline-flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
