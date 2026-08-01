import { Clock, User, Briefcase, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { ActivityItem } from "../../app/(pages)/(activity)/activity/types"
import { formatTimeAgo } from "@/lib/helpers"

export function ActivityCard({ activity }: { activity: ActivityItem }) {
  return (
    <div className="group bg-card text-card-foreground rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar Placeholder */}
        <div className="size-9 sm:size-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
          <User className="size-4 sm:size-5 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Clock className="size-3 shrink-0" />
            <span className="truncate">{formatTimeAgo(activity.createdAt)}</span>
          </div>

          <p className="text-sm text-foreground mb-3 leading-relaxed">
            <span className="font-bold">{activity.metadata.FullName}</span>{" "}
            <span className="text-muted-foreground">{activity.type}</span>
          </p>

          <Link href={`/open-gig/${activity.gigId}`} className="group/link flex w-full items-center gap-2 bg-muted px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors">
            <Briefcase className="size-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground group-hover/link:text-primary transition-colors truncate flex-1 min-w-0">
              {activity.metadata.gigTitle}
            </span>
            <ChevronRight className="size-4 text-muted-foreground group-hover/link:text-primary transition-colors shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
