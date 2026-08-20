import Link from "next/link"
import { Clock, Briefcase, ArrowUpRight, CheckCircle2, Sparkles, Send, PlusCircle, UserCheck } from "lucide-react"
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

function getInitials(name: string): string {
  if (!name) return "PG"
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function SuccessActivityCard({ activity }: SuccessActivityCardProps) {
  const meta = activity.metadata || {}
  const clientName = meta.clientName || meta.FullName || "Client"
  const freelancerName = meta.freelancerName || meta.FullName || "Freelancer"
  const gigTitle = meta.gigTitle || "Project Opportunity"
  const skills = Array.isArray(meta.skills) ? meta.skills : []
  const budget = meta.budget || ""

  const renderBadge = () => {
    switch (activity.type) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-xl shrink-0">
            <CheckCircle2 className="size-3.5" /> Project Done
          </span>
        )
      case "hired":
        return (
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-xl shrink-0">
            <Sparkles className="size-3.5" /> Talent Hired
          </span>
        )
      case "applied":
      case "pings":
        return (
          <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-xl shrink-0">
            <Send className="size-3.5" /> Pitch Sent
          </span>
        )
      case "posted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-xl shrink-0">
            <PlusCircle className="size-3.5" /> Gig Posted
          </span>
        )
    }
  }

  const renderNarrative = () => {
    switch (activity.type) {
      case "completed":
        return (
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border">
              {getInitials(freelancerName)}
            </div>
            <div>
              <p className="text-sm sm:text-base text-foreground font-semibold leading-snug">
                {freelancerName}
              </p>
              <p className="text-xs text-muted-foreground">
                Successfully delivered milestone for <span className="font-medium text-foreground">{clientName}</span>
              </p>
            </div>
          </div>
        )
      case "hired":
        return (
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border">
              {getInitials(clientName)}
            </div>
            <div>
              <p className="text-sm sm:text-base text-foreground font-semibold leading-snug">
                {clientName}
              </p>
              <p className="text-xs text-muted-foreground">
                Hired <span className="font-medium text-foreground">{freelancerName}</span> directly on platform
              </p>
            </div>
          </div>
        )
      case "applied":
      case "pings":
        return (
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border">
              {getInitials(freelancerName)}
            </div>
            <div>
              <p className="text-sm sm:text-base text-foreground font-semibold leading-snug">
                {freelancerName}
              </p>
              <p className="text-xs text-muted-foreground">
                Submitted a direct proposal for this project
              </p>
            </div>
          </div>
        )
      case "posted":
      default:
        return (
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border">
              {getInitials(clientName)}
            </div>
            <div>
              <p className="text-sm sm:text-base text-foreground font-semibold leading-snug">
                {clientName}
              </p>
              <p className="text-xs text-muted-foreground">
                Published a new project requirement
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-card text-card-foreground rounded-2xl border-2 border-border shadow-sm p-5 sm:p-6 shrink-0 flex flex-col justify-between transition-colors hover:border-primary w-full">
      <div className="space-y-4">
        {/* Top Bar: Action badge & Timestamp */}
        <div className="flex items-center justify-between gap-2">
          {renderBadge()}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
            <Clock className="size-3.5 shrink-0" />
            <span>{formatNaturalTimeAgo(activity.createdAt)}</span>
          </div>
        </div>

        {/* User Milestone Story */}
        {renderNarrative()}
      </div>

      {/* Embedded Project Box */}
      <div className="bg-muted rounded-xl p-3.5 sm:p-4 border border-border flex flex-col gap-2.5 mt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Briefcase className="size-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">
              {gigTitle}
            </span>
          </div>
          {budget && (
            <span className="bg-background text-foreground text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-border shrink-0">
              ₹{budget}
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
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
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-1 self-start"
            aria-label={`View details for ${gigTitle}`}
          >
            <span>View Gig Details</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
