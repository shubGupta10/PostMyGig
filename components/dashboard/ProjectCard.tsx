"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Flag, Eye, Briefcase, Plus, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import type { Project } from "@/app/dashboard/types"

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-primary text-primary-foreground border-transparent"
      case "expired":
        return "bg-destructive text-destructive-foreground border-transparent"
      default:
        return "bg-secondary text-secondary-foreground border-border"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Invalid date"
    }
  }

  return (
    <Card className="flex flex-col h-full border-2 border-border bg-card shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4 space-y-2.5 sm:space-y-3 flex-none relative">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 leading-tight">
            {project.title}
          </CardTitle>
          <Badge className={`${getStatusColor(project.status)} capitalize text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full shrink-0`}>
            {project.status}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm font-normal text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 py-0 sm:py-0 flex-1">
        <div className="space-y-2.5 sm:space-y-3 text-xs font-normal text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Created {project.createdAt ? formatDate(project.createdAt) : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Expires {project.expiresAt ? formatDate(project.expiresAt) : "N/A"}</span>
          </div>
          {project.isFlagged && (
            <div className="flex items-center gap-2 text-destructive mt-2">
              <Flag className="h-4 w-4 shrink-0" />
              <span className="font-semibold">Flagged for review ({project.reportCount ?? 0})</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 sm:p-6 pt-4 sm:pt-5 flex-none mt-auto border-t border-border">
        {project.AcceptedFreelancerEmail ? (
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => router.push(`/projects/${project._id}/huddle`)}
              className="flex-1 justify-center h-10 font-semibold text-xs rounded-xl shadow-xs cursor-pointer bg-primary text-primary-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Open Project Huddle
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/open-gig/${project._id}`)}
              className="px-3 justify-center h-10 font-semibold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
              title="View Gig Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => router.push(`/open-gig/${project._id}`)}
            className="w-full justify-center h-10 font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function EmptyState({ message = "No projects found" }: { message?: string }) {
  const router = useRouter()

  return (
    <Card className="border-2 border-dashed border-border bg-card p-6 sm:p-12 text-center rounded-2xl flex flex-col items-center justify-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
        <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground font-normal max-w-sm mb-6 sm:mb-8 leading-relaxed">
        Create your first gig to start receiving applications from professionals.
      </p>
      <Button
        onClick={() => router.push("/add-gigs")}
        className="h-11 bg-primary text-primary-foreground font-semibold text-sm px-8 rounded-xl transition-colors shadow-xs cursor-pointer"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Gig
      </Button>
    </Card>
  )
}

