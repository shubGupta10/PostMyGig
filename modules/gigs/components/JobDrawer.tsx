"use client"

import { MouseEvent, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExpandableText } from "@/components/ui/expandable-text"
import {
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  CheckCheck,
  RefreshCw,
  Eye,
  Trash2,
  Star,
  X,
  Tag,
  User2Icon,
} from "lucide-react"
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
import { toast } from "sonner"
import type { UserGig } from "@/app/(pages)/(gig)/my-jobs/types"
import Link from "next/link"

interface JobDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: UserGig
  onDelete: (project: UserGig) => void
  deletingId: string | null
}

export function JobDrawer({
  open,
  onOpenChange,
  project,
  onDelete,
  deletingId,
}: JobDrawerProps) {
  const router = useRouter()
  const [renewing, setRenewing] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleCompleteGig = async (e: MouseEvent) => {
    e.stopPropagation()
    setIsCompleting(true)
    try {
      const res = await fetch("/api/gigs/complete-gig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId: project._id, rating, comment }),
      })
      if (!res.ok) throw new Error("Failed to complete gig")
      toast.success("Project marked as completed!")
      router.refresh()
    } catch {
      toast.error("Failed to mark as completed")
    } finally {
      setIsCompleting(false)
      setRating(0)
      setComment("")
      onOpenChange(false)
    }
  }

  const handleRenew = async (e: MouseEvent) => {
    e.stopPropagation()
    try {
      setRenewing(true)
      const res = await fetch("/api/gigs/renew-gig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId: project._id }),
      })
      if (!res.ok) throw new Error("Failed to renew")
      toast.success("Gig renewed for 45 days!")
      router.refresh()
    } catch (err) {
      toast.error("Failed to renew gig")
    } finally {
      setRenewing(false)
    }
  }

  const renderCompleteProjectAction = (className: string) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isCompleting} className={className}>
          <CheckCheck className={`w-4 h-4 mr-1.5 shrink-0 ${isCompleting ? "animate-spin" : ""}`} />
          {isCompleting ? "Completing..." : "Complete Project"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Project & Review Freelancer</AlertDialogTitle>
          <AlertDialogDescription>
            The project will be closed. Please rate the freelancer and leave a review about their work.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <p className="text-sm font-semibold mb-2">Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground hover:text-yellow-400"
                      } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Written Review</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience working with this freelancer..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { setRating(0); setComment(""); }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCompleteGig}
            disabled={rating === 0 || comment.trim() === ""}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Confirm & Submit Review
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex flex-col h-full max-w-xl w-full ml-auto">
        {/* Header */}
        <DrawerHeader className="flex-none border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <DrawerTitle className="text-lg font-semibold text-foreground leading-snug">
                {project.title}
              </DrawerTitle>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-primary text-primary-foreground capitalize text-xs font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                  {project.status.replace(/_/g, " ")}
                </Badge>
                {project.status === "in_progress" && (
                  <div className="ml-auto shrink-0 sm:hidden">
                    {renderCompleteProjectAction("h-8 px-2.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-semibold rounded-lg whitespace-nowrap")}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                Posted: {formatDate(project.createdAt)}
              </span>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 rounded-lg"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Project Meta */}
          <section className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Project Info
            </p>
            <div className="bg-muted rounded-xl p-4 border border-border space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-sm font-medium text-foreground">
                    {project.budget}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(project.expiresAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Gig Description
            </p>
            <div className="bg-muted/40 rounded-xl p-5 border border-border">
              <ExpandableText
                text={project.description}
                className="text-sm text-foreground whitespace-pre-wrap min-w-0 break-words"
              />
            </div>
          </section>

          {/* Skills Required */}
          {project.skillsRequired && project.skillsRequired.length > 0 && (
            <section className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Skills Required
              </p>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Accepted Freelancer */}
          {project.AcceptedFreelancerEmail && (
            <section className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Accepted Freelancer
              </p>
              <div className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <User2Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Link
                    href={project.AcceptedFreelancerDetails?._id ? `/user/profile/${project.AcceptedFreelancerDetails._id}` : `/applications/view-applications?gigId=${project._id}`}
                    className="text-sm font-medium text-foreground hover:text-primary underline transition-colors truncate"
                  >
                    {project.AcceptedFreelancerDetails?.name || project.AcceptedFreelancerEmail}
                  </Link>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/projects/${project._id}/huddle`)
                  }}
                  className="bg-primary text-primary-foreground font-semibold h-10 px-4 rounded-xl shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Project Huddle
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-none border-t border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:flex-nowrap sm:justify-end gap-2.5 bg-card w-full">
          <Button
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(project)
              onOpenChange(false)
            }}
            disabled={deletingId === project._id}
            className="flex-none w-full sm:w-auto h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 whitespace-nowrap"
          >
            {deletingId === project._id ? (
              <RefreshCw className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-1.5 shrink-0" />
            )}
            Delete Project
          </Button>

          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/applications/view-applications?gigId=${project._id}`)
            }}
            className="flex-none w-full sm:w-auto h-10 px-4 text-xs sm:text-sm border-border font-semibold rounded-xl whitespace-nowrap"
          >
            <Eye className="w-4 h-4 mr-1.5 shrink-0" />
            View Applications
          </Button>

          {project.status === "in_progress" && (
            <div className="hidden sm:block">
              {renderCompleteProjectAction("flex-none w-auto h-10 px-4 text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 font-semibold rounded-xl whitespace-nowrap")}
            </div>
          )}

          {project.status === "expired" && (
            <Button
              onClick={handleRenew}
              disabled={renewing}
              className="flex-none w-full sm:w-auto h-10 px-4 text-xs sm:text-sm bg-primary text-primary-foreground font-semibold rounded-xl whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 shrink-0 ${renewing ? "animate-spin" : ""}`} />
              {renewing ? "Renewing..." : "Renew"}
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
