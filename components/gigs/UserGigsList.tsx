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
      <div className="text-center py-20">
        <div className="bg-card text-card-foreground rounded-xl shadow-sm p-12 max-w-2xl mx-auto border border-border">
          <div className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
            <Briefcase className="size-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">No Projects Found</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            You haven't posted any gigs yet. Start sharing your projects with the community and find the perfect collaborators for your work.
          </p>
          <button
            onClick={() => router.push("/add-gigs")}
            className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-sm transition-opacity flex items-center gap-2 mx-auto"
          >
            <Plus className="size-5" />
            Create Your First Gig
          </button>
        </div>
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
