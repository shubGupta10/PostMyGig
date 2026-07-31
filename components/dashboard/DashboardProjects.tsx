"use client"

import { ProjectCard, EmptyState } from "./ProjectCard"
import type { Project } from "@/app/dashboard/types"

interface DashboardProjectsProps {
  projects: Project[]
}

export function DashboardProjects({
  projects,
}: DashboardProjectsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Your Projects</h2>
          <p className="text-sm text-muted-foreground font-normal mt-1">Manage and track your gigs</p>
        </div>
      </div>

      <div className="mt-0 outline-none">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
