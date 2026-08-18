import Link from "next/link"
import { Clock, Briefcase, ArrowUpRight, CheckCircle2, Sparkles, Send, PlusCircle } from "lucide-react"
import type { LandingActivityItem } from "../types"

interface SuccessActivityCardProps {
  activity: LandingActivityItem
}

function formatNaturalTimeAgo(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Recent"
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return "Recent"

  const now = new Date()
  const diffMs = Math.max(0, now.getTime() - date.getTime())
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMinutes < 5) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours === 1) return "1h ago"
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks === 1) return "1 week ago"
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`
  if (diffMonths === 1) return "1 month ago"
  if (diffMonths < 12) return `${diffMonths} months ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

export function SuccessActivityCard({ activity }: SuccessActivityCardProps) {
  const meta = activity.metadata || {}
  const clientName = meta.clientName || meta.FullName || "Client"
  const freelancerName = meta.freelancerName || meta.FullName || "Freelancer"
  const gigTitle = meta.gigTitle || "Untitled Project"
  const skills = Array.isArray(meta.skills) ? meta.skills : []
  const budget = meta.budget || ""

  const renderBadge = () => {
    switch (activity.type) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-xl">
            <CheckCircle2 className="size-3.5" /> Project Completed
          </span>
        )
      case "hired":
        return (
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-xl">
            <Sparkles className="size-3.5" /> Freelancer Hired
          </span>
        )
      case "applied":
      case "pings":
        return (
          <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-xl">
            <Send className="size-3.5" /> Pitch Submitted
          </span>
        )
      case "posted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-xl">
            <PlusCircle className="size-3.5" /> Gig Posted
          </span>
        )
    }
  }

  const renderStoryHeadline = () => {
    switch (activity.type) {
      case "completed":
        return (
          <p className="text-sm sm:text-base text-card-foreground leading-relaxed mb-4">
            <span className="font-bold text-foreground">{clientName}</span> and{" "}
            <span className="font-bold text-foreground">{freelancerName}</span> successfully completed work.
          </p>
        )
      case "hired":
        return (
          <p className="text-sm sm:text-base text-card-foreground leading-relaxed mb-4">
            <span className="font-bold text-foreground">{clientName}</span> hired{" "}
            <span className="font-bold text-foreground">{freelancerName}</span> directly for this project.
          </p>
        )
      case "applied":
      case "pings":
        return (
          <p className="text-sm sm:text-base text-card-foreground leading-relaxed mb-4">
            <span className="font-bold text-foreground">{freelancerName}</span> submitted a direct pitch.
          </p>
        )
      case "posted":
      default:
        return (
          <p className="text-sm sm:text-base text-card-foreground leading-relaxed mb-4">
            <span className="font-bold text-foreground">{clientName}</span> published a new requirement.
          </p>
        )
    }
  }

  return (
    <div className="bg-muted text-card-foreground rounded-2xl border-2 border-border shadow-sm p-6 sm:p-7 shrink-0 flex flex-col justify-between transition-all">
      <div>
        {/* Top Header: Badge & Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {renderBadge()}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
            <Clock className="size-3.5 shrink-0" />
            <span>{formatNaturalTimeAgo(activity.createdAt)}</span>
          </div>
        </div>

        {/* Narrative */}
        {renderStoryHeadline()}
      </div>

      {/* Inner Gig Box */}
      <div className="bg-background rounded-xl p-4 border border-border flex flex-col gap-2.5 mt-auto">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Briefcase className="size-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">
              {gigTitle}
            </span>
          </div>
          {budget && (
            <span className="bg-muted text-foreground text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-border shrink-0">
              ₹{budget}
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-0.5 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {activity.gigId && !activity.gigId.startsWith("story") && (
          <Link
            href={`/open-gig/${activity.gigId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-1.5 self-start"
          >
            <span>View Gig Details</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
