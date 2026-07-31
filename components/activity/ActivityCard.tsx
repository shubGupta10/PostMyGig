import { Clock, User, Briefcase, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { ActivityItem } from "../../app/(pages)/(activity)/activity/types"

export function ActivityCard({ activity }: { activity: ActivityItem }) {
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const activityDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return activityDate.toLocaleDateString()
  }

  const getActivityText = (type: string): string => {
    switch (type) {
      case "pings":
        return "pinged the gig"
      case "posted":
        return "posted a new gig"
      default:
        return "interacted with"
    }
  }

  return (
    <div className="group bg-card text-card-foreground rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-4">
        {/* Avatar Placeholder */}
        <div className="size-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
          <User className="size-5 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Clock className="size-3" />
            <span>{formatTimeAgo(activity.createdAt)}</span>
          </div>

          <p className="text-sm text-foreground mb-3 leading-relaxed">
            <span className="font-bold">{activity.metadata.FullName}</span>{" "}
            <span className="text-muted-foreground">{getActivityText(activity.type)}</span>
          </p>

          <Link href={`/open-gig/${activity.gigId}`} className="group/link inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors">
            <Briefcase className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground group-hover/link:text-primary transition-colors truncate max-w-[200px] sm:max-w-[400px]">
              {activity.metadata.gigTitle}
            </span>
            <ChevronRight className="size-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}
