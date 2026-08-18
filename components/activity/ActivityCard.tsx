import { Clock, User, Briefcase, ChevronRight, CheckCircle2, Sparkles, Send, PlusCircle } from "lucide-react"
import Link from "next/link"
import type { ActivityItem } from "../../app/(pages)/(activity)/activity/types"
import { formatTimeAgo } from "@/lib/helpers"

export function ActivityCard({ activity }: { activity: ActivityItem }) {
  const meta = activity.metadata
  const clientName = meta.clientName || meta.FullName || "A client"
  const freelancerName = meta.freelancerName || meta.FullName || "A freelancer"

  const renderActionText = () => {
    switch (activity.type) {
      case "posted":
        return (
          <>
            <span className="font-bold text-foreground">{clientName}</span>{" "}
            <span className="text-muted-foreground">posted a new gig</span>
          </>
        )
      case "applied":
      case "pings":
        return (
          <>
            <span className="font-bold text-foreground">{freelancerName}</span>{" "}
            <span className="text-muted-foreground">pitched for this project</span>
          </>
        )
      case "hired":
        return (
          <>
            <span className="font-bold text-foreground">{clientName}</span>{" "}
            <span className="text-muted-foreground">hired</span>{" "}
            <span className="font-bold text-foreground">{freelancerName}</span>
          </>
        )
      case "completed":
        return (
          <>
            <span className="font-bold text-foreground">{clientName}</span>{" "}
            <span className="text-muted-foreground">&</span>{" "}
            <span className="font-bold text-foreground">{freelancerName}</span>{" "}
            <span className="text-primary font-semibold">completed the project</span>
          </>
        )
      default:
        return (
          <>
            <span className="font-bold text-foreground">{clientName}</span>{" "}
            <span className="text-muted-foreground">{activity.type}</span>
          </>
        )
    }
  }

  const renderIcon = () => {
    switch (activity.type) {
      case "completed":
        return <CheckCircle2 className="size-4 text-primary" />
      case "hired":
        return <Sparkles className="size-4 text-primary" />
      case "applied":
      case "pings":
        return <Send className="size-4 text-foreground" />
      case "posted":
      default:
        return <PlusCircle className="size-4 text-primary" />
    }
  }

  return (
    <div className="group bg-card text-card-foreground rounded-2xl border-2 border-border shadow-sm hover:border-border transition-all p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Type Icon Badge */}
        <div className="size-9 sm:size-10 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0">
          {renderIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Clock className="size-3 shrink-0" />
            <span className="truncate">{formatTimeAgo(activity.createdAt)}</span>
          </div>

          <p className="text-sm mb-3 leading-relaxed">
            {renderActionText()}
          </p>

          <Link href={`/open-gig/${activity.gigId}`} className="group/link flex w-full items-center gap-2 bg-muted p-3 rounded-xl border border-border hover:border-primary transition-colors">
            <Briefcase className="size-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground group-hover/link:text-primary transition-colors truncate flex-1 min-w-0">
              {meta.gigTitle}
            </span>
            {meta.budget && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-background border border-border text-foreground shrink-0">
                ₹{meta.budget}
              </span>
            )}
            <ChevronRight className="size-4 text-muted-foreground group-hover/link:text-primary transition-colors shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
