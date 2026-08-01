"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Flag, Eye, Briefcase, Plus } from "lucide-react"
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
        return "bg-card text-foreground border-border"
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
    <Card className="flex flex-col h-full border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4 space-y-2.5 sm:space-y-3 flex-none relative">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <CardTitle className="text-base sm:text-lg font-semibold text-primary line-clamp-2 leading-tight">
            {project.title}
          </CardTitle>
          <Badge className={`${getStatusColor(project.status)} capitalize text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full shrink-0 shadow-xs`}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm font-normal text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 py-0 sm:py-0 flex-1">
        <div className="space-y-2.5 sm:space-y-3 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-secondary-foreground shrink-0" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-secondary-foreground shrink-0" />
            <span>Expires {formatDate(project.expiresAt)}</span>
          </div>
          {project.isFlagged && (
            <div className="flex items-center gap-2 text-destructive mt-2">
              <Flag className="h-4 w-4 shrink-0" />
              <span className="font-semibold">Flagged for review ({project.reportCount})</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-4 sm:pt-5 flex-none mt-auto border-t border-border/50">
        <Button
          onClick={() => router.push(`/open-gig/${project._id}`)}
          className="w-full justify-center h-11 sm:h-10 bg-secondary text-secondary-foreground hover:opacity-90 font-semibold text-sm transition-all rounded-lg shadow-sm cursor-pointer"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export function EmptyState({ message = "No projects found" }: { message?: string }) {
  const router = useRouter()

  return (
    <Card className="border border-dashed border-border bg-card p-6 sm:p-12 text-center rounded-xl flex flex-col items-center justify-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
        <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{message}</h3>
      <p className="text-sm text-foreground opacity-80 font-normal max-w-sm mb-6 sm:mb-8 leading-relaxed">
        Create your first gig to start receiving applications from professionals.
      </p>
      <Button
        onClick={() => router.push("/add-gigs")}
        className="h-11 bg-primary text-primary-foreground font-semibold text-sm px-8 rounded-xl transition-colors shadow-sm cursor-pointer"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Gig
      </Button>
    </Card>
  )
}
