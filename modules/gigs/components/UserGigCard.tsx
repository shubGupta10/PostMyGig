"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye } from "lucide-react"
import { JobDrawer } from "./JobDrawer"
import type { UserGig } from "@/app/(pages)/(gig)/my-jobs/types"
import { formatActivityDate } from "@/lib/helpers"

interface UserGigCardProps {
  project: UserGig
  deletingId: string | null
  onDelete: (project: UserGig) => void
}

export function UserGigCard({ project, deletingId, onDelete }: UserGigCardProps) {
  const [open, setOpen] = useState(false)

  const isUpdated = Boolean(
    (project as any).updatedAt &&
    new Date((project as any).updatedAt).getTime() - new Date(project.createdAt).getTime() > 60000
  )

  const activityText = isUpdated
    ? formatActivityDate((project as any).updatedAt, "Updated")
    : formatActivityDate(project.createdAt, "Posted")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_progress":
        return "bg-primary text-primary-foreground border-transparent shadow-xs"
      case "open":
        return "bg-secondary text-secondary-foreground border-border"
      case "expired":
        return "bg-destructive text-destructive-foreground border-transparent shadow-xs"
      case "completed":
        return "bg-muted text-foreground border-border"
      default:
        return "bg-secondary text-secondary-foreground border-border"
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="w-full text-left bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs hover:border-border/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
      >
        {/* Left: title + badge + activity */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <Badge className={`capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${getStatusColor(project.status)}`}>
              {project.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{activityText}</span>
          </div>
        </div>

        {/* Right: view details button */}
        <div className="shrink-0">
          <Button
            className="h-10 px-5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-none"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View Details
          </Button>
        </div>
      </div>

      <JobDrawer
        open={open}
        onOpenChange={setOpen}
        project={project}
        onDelete={onDelete}
        deletingId={deletingId}
      />
    </>
  )
}
