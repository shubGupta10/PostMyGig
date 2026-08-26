"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserGigCard } from "./UserGigCard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { PaginationInfo, UserGig } from "@/app/(pages)/(gig)/my-jobs/types"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { groupItemsByTimeline } from "@/lib/helpers"

interface UserGigsListProps {
  initialProjects: UserGig[]
  pagination: PaginationInfo | null
}

export function UserGigsList({ initialProjects, pagination }: UserGigsListProps) {

  const [projects, setProjects] = useState<UserGig[]>(initialProjects)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<UserGig | null>(null)
  const router = useRouter()

  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const openDeleteDialog = (project: UserGig) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const deleteUserGig = async (gigId: string) => {
    try {
      setDeletingId(gigId)
      const result = await fetch("/api/gigs/delete-user-gigs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gigId }),
      })

      if (!result.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((p) => p._id !== gigId))
      toast.success("Project deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Error deleting project")
      console.error(error)
    } finally {
      setDeletingId(null)
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="bg-muted rounded-xl p-10 text-center border border-border max-w-2xl mx-auto my-8">
        <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-1">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mb-6">
          You haven't posted any gigs yet. Start sharing your projects with the community and find the perfect collaborators for your work.
        </p>
        <button
          onClick={() => router.push("/add-gigs")}
          className="bg-primary text-primary-foreground font-semibold h-11 px-6 rounded-xl inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" />
          Create Your First Gig
        </button>
      </div>
    )
  }

  const groupedProjects = groupItemsByTimeline(
    projects,
    (p) => (p as any).updatedAt || p.createdAt
  );

  return (
    <div className="space-y-8">
      {groupedProjects.map((group) => (
        <div key={group.label} className="space-y-4">
          {/* Timeline Section Header */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="flex flex-col gap-4">
            {group.items.map((project) => (
              <UserGigCard
                key={project._id}
                project={project}
                deletingId={deletingId}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        </div>
      ))}

      {
        pagination && pagination.totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-border">
            <Pagination>
              <PaginationContent>

                {/* Previous button */}
                <PaginationItem>
                  <PaginationPrevious
                    href={pagination.hasPrevPage ? `?page=${pagination.page - 1}` : undefined}
                    className={!pagination.hasPrevPage ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`?page=${pageNum}`}
                      isActive={pageNum === pagination.page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {/* next button */}
                <PaginationItem>
                  <PaginationNext
                    href={pagination.hasNextPage ? `?page=${pagination.page + 1}` : undefined}
                    className={!pagination.hasNextPage ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )
      }

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card text-card-foreground border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete "{projectToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-accent border border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && deleteUserGig(projectToDelete._id)}
              className="bg-destructive hover:opacity-90 text-destructive-foreground focus:ring-destructive border border-border"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  )
}
