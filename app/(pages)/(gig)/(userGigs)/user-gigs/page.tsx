"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
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
import { AlertCircle, RefreshCw, Briefcase, Eye, Trash2, Plus, ArrowRight } from "lucide-react"

interface Contact {
  email: string
  whatsapp: string
  x: string
}

interface Project {
  _id: string
  title: string
  description: string
  createdBy: string
  budget: string
  AcceptedFreelancerEmail: string
  skillsRequired: string[]
  contact: Contact
  displayContactLinks: boolean
  status: "completed" | "active" | "pending"
  expiresAt: string
  reportCount: number
  isFlagged: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  message: string
  projects?: Project[]
}

function UserGigs() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [noProjects, setNoProjects] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const router = useRouter()

  const fetchUserGigs = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      setNoProjects(false)

      const response = await fetch("/api/gigs/fetch-all-user-gigs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data: ApiResponse = await response.json()

      // Handle 204 status code - User does not have any projects
      if (response.status === 204) {
        setProjects([])
        setNoProjects(true)
        return
      }

      // Handle other non-ok responses
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects")
      }

      // Handle successful response with projects
      if (data.projects) {
        setProjects(data.projects)
        setNoProjects(data.projects.length === 0)
      } else {
        setProjects([])
        setNoProjects(true)
      }
    } catch (error) {
      console.error("Error fetching user gigs:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setProjects([])
      setNoProjects(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserGigs()
  }, [])

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

      const updatedProjects = projects.filter((project) => project._id !== gigId)
      setProjects(updatedProjects)

      // Check if this was the last project
      if (updatedProjects.length === 0) {
        setNoProjects(true)
      }

      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error("Error deleting project")
      setError(error instanceof Error ? error.message : "Failed to delete project")
    } finally {
      setDeletingId(null)
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteUserGig(projectToDelete._id)
    }
  }

  const handleCreateNewGig = () => {
    router.push("/create-gig") // Adjust this path to your actual create gig route
  }

  const getStatusBadge = (status: Project["status"]): string => {
    const statusColors: Record<Project["status"], string> = {
      completed: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors",
      active: "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 transition-colors",
      pending: "bg-accent text-accent-foreground shadow-md hover:bg-accent/90 transition-colors",
    }

    return statusColors[status] || "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 transition-colors"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="h-8 bg-muted rounded-lg w-64 mb-3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-lg w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-card text-card-foreground rounded-xl shadow-lg border border-border p-8 animate-pulse">
                <div className="h-6 bg-muted rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-muted rounded-lg w-5/6 mb-6"></div>
                <div className="h-8 bg-muted rounded-lg w-20 mb-4"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-6 bg-muted rounded-full w-16"></div>
                  <div className="h-6 bg-muted rounded-full w-20"></div>
                </div>
                <div className="h-10 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card text-card-foreground border border-destructive/50 rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Unable to Load Projects</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <button
              onClick={fetchUserGigs}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Gigs</h1>
          <p className="text-lg text-muted-foreground">Manage and track your own published gigs and applied gigs</p>
          <div className="mt-6 bg-card text-card-foreground rounded-lg p-4 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Total Projects: <span className="text-primary font-bold">{projects.length}</span>
              </span>
              <button
                onClick={fetchUserGigs}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-md px-2 py-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {noProjects || projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-card text-card-foreground rounded-xl shadow-lg p-12 max-w-2xl mx-auto border border-border">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-border">
                <Briefcase className="w-12 h-12 text-primary" />
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-4">User does not have any projects</h3>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Go and create a new gig and it will show here. Start sharing your projects with the community and find
                the perfect collaborators for your work.
              </p>

              <button
                onClick={handleCreateNewGig}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                <Plus className="w-6 h-6" />
                Create Your First Gig
              </button>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-card text-card-foreground rounded-xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-foreground leading-tight pr-4">{project.title}</h3>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold cursor-default ${getStatusBadge(project.status)}`}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                      {isExpired(project.expiresAt) && (
                        <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium border border-destructive/20">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">{project.budget}</span>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Budget</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Skills Required:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-border hover:bg-secondary/90 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skillsRequired.length > 4 && (
                          <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">
                            +{project.skillsRequired.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {project.AcceptedFreelancerEmail && (
                      <div className="mb-4 p-3 bg-muted rounded-lg border border-primary/20">
                        <p className="text-sm font-semibold dark:text-foreground text-foreground mb-1">Accepted Freelancer:</p>
                        <p className="text-sm text-accent-foreground truncate font-medium">{project.AcceptedFreelancerEmail}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted rounded-lg p-4 mb-6 border border-border">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-semibold text-foreground">{formatDate(project.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Expires</p>
                        <p
                          className={`font-semibold ${isExpired(project.expiresAt) ? "text-destructive" : "text-foreground"}`}
                        >
                          {formatDate(project.expiresAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-accent-foreground text-primary-foreground py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card border border-primary/20"
                      onClick={() => {
                        router.push(`/applications/view-applications?gigId=${project._id}`)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View Applications
                    </button>

                    <button
                      className={`bg-destructive hover:bg-destructive text-accent-foreground py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card border border-destructive/20 ${
                        deletingId === project._id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => openDeleteDialog(project)}
                      disabled={deletingId === project._id}
                    >
                      {deletingId === project._id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card text-card-foreground border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete "{projectToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/90 border border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive border border-destructive/20"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserGigs