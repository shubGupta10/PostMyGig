"use client"

import { Eye, Trash2, RefreshCw, Calendar, Clock, DollarSign, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { UserGig } from "@/app/(pages)/(gig)/(userGigs)/user-gigs/types"

interface UserGigCardProps {
  project: UserGig
  deletingId: string | null
  onDelete: (project: any) => void
}

export function UserGigCard({ project, deletingId, onDelete }: UserGigCardProps) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <span className="border border-border text-primary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity className="size-3" /> Completed</span>
      case "active":
        return <span className="border border-border text-secondary-foreground px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity className="size-3" /> Active</span>
      case "pending":
      default:
        return <span className="border border-border text-accent-foreground px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity className="size-3" /> Pending</span>
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <AccordionItem 
      value={project._id} 
      className="group bg-card text-card-foreground rounded-2xl border-2 border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <AccordionTrigger className="p-5 sm:p-6 hover:no-underline hover:bg-muted transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-6 pr-4">
          
          {/* Left Column: Info */}
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-lg font-bold text-foreground mb-2 truncate">
              {project.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {getStatusBadge(project.status)}
              
              <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md border border-border">
                <Calendar className="size-3.5" />
                <span className="font-bold text-[10px] uppercase tracking-wider">Posted {formatDate(project.createdAt)}</span>
              </div>

              {isExpired(project.expiresAt) && (
                <div className="flex items-center gap-1.5 border border-border text-muted-foreground px-2.5 py-1 rounded-md">
                  <Clock className="size-3.5" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">Expired</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Meta */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
            {/* Budget Pill */}
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-xl border border-border text-left">
              <div className="size-7 rounded-full bg-background flex items-center justify-center border border-border">
                <DollarSign className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Budget</span>
                <span className="text-sm font-bold text-foreground leading-none">{project.budget}</span>
              </div>
            </div>
          </div>

        </div>
      </AccordionTrigger>

      <AccordionContent className="p-5 sm:p-6 pt-0 sm:pt-0 border-t border-border">
        <div className="mt-6 flex flex-col gap-6">
          
          {/* Description */}
          <div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Description</h4>
            <p className="text-sm text-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Skills Required */}
          {project.skillsRequired && project.skillsRequired.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Skills Required</h4>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-muted text-foreground px-2.5 py-1 rounded-md text-xs font-medium border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Accepted Freelancer */}
          {project.AcceptedFreelancerEmail && (
            <div className="bg-muted p-4 rounded-xl border border-border">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Accepted Freelancer</h4>
              <p className="text-sm font-medium text-foreground">{project.AcceptedFreelancerEmail}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/applications/view-applications?gigId=${project._id}`)
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground bg-muted hover:bg-primary hover:text-primary-foreground border border-border transition-colors"
              title="View Applications"
            >
              <Eye className="size-4" />
              <span>View Applications</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project)
              }}
              disabled={deletingId === project._id}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border transition-colors ${
                deletingId === project._id
                  ? "text-muted-foreground bg-muted opacity-50 cursor-not-allowed"
                  : "text-destructive bg-muted hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              }`}
              title="Delete Project"
            >
              {deletingId === project._id ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
