"use client"

import { useState } from "react"
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
import { Accordion } from "@/components/ui/accordion"
import type { UserGig } from "@/app/(pages)/(gig)/(userGigs)/user-gigs/types"

interface UserGigsListProps {
  initialProjects: UserGig[]
}

export function UserGigsList({ initialProjects }: UserGigsListProps) {
  const [projects, setProjects] = useState<UserGig[]>(initialProjects)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<UserGig | null>(null)
  const router = useRouter()

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

  return (
    <>
      <Accordion type="multiple" className="flex flex-col gap-4">
        {projects.map((project) => (
          <UserGigCard
            key={project._id}
            project={project}
            deletingId={deletingId}
            onDelete={openDeleteDialog}
          />
        ))}
      </Accordion>

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
    </>
  )
}
