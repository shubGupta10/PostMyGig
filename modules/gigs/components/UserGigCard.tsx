"use client"

import { Eye, Trash2, RefreshCw, Calendar, Clock, DollarSign, Activity, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { UserGig } from "@/app/(pages)/(gig)/my-jobs/types"
import { useState } from "react"
import { toast } from "sonner"
import { MouseEvent } from "react"
import { getDateSectionLabel, formatActivityDate } from "@/lib/helpers"

interface UserGigCardProps {
  project: UserGig
  deletingId: string | null
  onDelete: (project: any) => void
}

export function UserGigCard({ project, deletingId, onDelete }: UserGigCardProps) {
  const router = useRouter();
  const [renewing, setRenewing] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleRenew = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      setRenewing(true);
      const res = await fetch("/api/gigs/renew-gig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId: project._id }),
      });
      if (!res.ok) throw new Error("Failed to renew");
      toast.success("Gig renewed for 45 days!");
      router.refresh();
    } catch (err) {
      toast.error("Failed to renew gig");
    } finally {
      setRenewing(false);
    }
  };

  const isUpdated = Boolean(
    (project as any).updatedAt &&
    new Date((project as any).updatedAt).getTime() - new Date(project.createdAt).getTime() > 60000
  )

  const activityText = isUpdated
    ? formatActivityDate((project as any).updatedAt, "Updated")
    : formatActivityDate(project.createdAt, "Posted")

  return (
    <AccordionItem
      value={project._id}
      className="group bg-card text-card-foreground rounded-2xl border-2 border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <AccordionTrigger className="p-5 sm:p-6 hover:no-underline hover:bg-muted transition-colors">
        <div className="flex items-center justify-between w-full gap-3 sm:gap-6 pr-2 sm:pr-4">

          {/* Left Column: Title, Status & Activity */}
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0 text-left">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                {project.title}
              </h3>
              <Badge className="bg-secondary text-secondary-foreground border-border border font-medium px-2.5 py-1 capitalize text-xs">
                {project.status}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground font-normal">
              {activityText}
            </span>
          </div>


          {/* Right Column: Budget */}
          <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-border shrink-0">
            <DollarSign className="size-3.5 sm:size-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold text-foreground">{project.budget}</span>
          </div>

        </div>
      </AccordionTrigger>

      <AccordionContent className="p-5 sm:p-6 pt-0 sm:pt-0 border-t border-border">
        <div className="mt-6 flex flex-col gap-6">

          {/* Metadata Block (Posted & Expiration) */}
          <div className="bg-muted rounded-xl p-4 border border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                <strong className="text-muted-foreground uppercase text-[10px] tracking-wider block sm:inline sm:mr-1">Posted:</strong>
                {formatDate(project.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                <strong className="text-muted-foreground uppercase text-[10px] tracking-wider block sm:inline sm:mr-1">Expires:</strong>
                {formatDate(project.expiresAt)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Skills Required */}
          {project.skillsRequired && project.skillsRequired.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Skills Required</p>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Accepted Freelancer */}
          {project.AcceptedFreelancerEmail && (
            <div className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Accepted Freelancer</p>
                <p className="text-sm font-medium text-foreground">{project.AcceptedFreelancerEmail}</p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/projects/${project._id}/huddle`)
                }}
                className="bg-primary text-primary-foreground font-semibold text-xs h-10 px-4 rounded-xl shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Project Huddle</span>
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            {project.status === "expired" && (
              <Button
                onClick={handleRenew}
                disabled={renewing}
                className="bg-primary text-primary-foreground font-semibold flex items-center gap-2"
              >
                <RefreshCw className={`size-4 ${renewing ? "animate-spin" : ""}`} />
                <span>{renewing ? "Renewing..." : "Renew"}</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/applications/view-applications?gigId=${project._id}`)
              }}
              className="border-border font-semibold flex items-center gap-2"
              title="View Applications"
            >
              <Eye className="size-4" />
              <span>View Applications</span>
            </Button>

            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project)
              }}
              disabled={deletingId === project._id}
              className="bg-destructive text-destructive-foreground font-semibold flex items-center gap-2"
              title="Delete Project"
            >
              {deletingId === project._id ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
