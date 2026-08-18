"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ExternalLink, Trash2, Loader2 } from "lucide-react"
import { AdminProject } from "./types"

interface AdminProjectsTabProps {
  projects: AdminProject[]
  onDeleteProject: (projectId: string) => Promise<void>
  deletingProjectId: string | null
}

export function AdminProjectsTab({
  projects,
  onDeleteProject,
  deletingProjectId,
}: AdminProjectsTabProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Projects Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Monitor and manage all projects on the platform</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project._id} className="border border-border hover:shadow-md transition-shadow w-full min-w-0 max-w-full overflow-hidden">
                <CardHeader className="pb-3 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/open-gig/${project._id}`}
                        target="_blank"
                        className="group/title block min-w-0"
                      >
                        <CardTitle className="text-base sm:text-lg font-bold line-clamp-2 break-words hover:text-primary transition-colors cursor-pointer">
                          {project.title}
                        </CardTitle>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0 mt-0.5">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                        <Link href={`/open-gig/${project._id}`} target="_blank" title="Open Gig Page">
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingProjectId === project._id}
                          >
                            {deletingProjectId === project._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteProject(project._id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">{project.description}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          className={
                            project.status === "active"
                              ? "bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-semibold"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-semibold"
                          }
                        >
                          {project.status}
                        </Badge>
                        {project.isCurated ? (
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[10px] font-semibold">
                            Curated / Seeded
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">
                            User Posted
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-primary">{project.budget}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.skillsRequired?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] sm:text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skillsRequired && project.skillsRequired.length > 3 && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          +{project.skillsRequired.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No projects data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
