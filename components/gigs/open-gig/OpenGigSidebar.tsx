"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DollarSign, Calendar, Clock, CheckCircle, Pen, Trash2, ShieldCheck, Info } from "lucide-react"
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
import type { Gig, Owner } from "@/app/(pages)/(gig)/types"
import { getStatusConfig, formatDate, getDaysUntilExpiry } from "./utils"
import { deleteGig } from "@/app/(pages)/(gig)/open-gig/[gigId]/services/gigApi"
import { toast } from "sonner"

interface OpenGigSidebarProps {
  gig: Gig
  owner: Owner | null
  isPinged: boolean
  canApply: boolean
  disabledMessage: string
}

export function OpenGigSidebar({ gig, owner, isPinged, canApply, disabledMessage }: OpenGigSidebarProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await deleteGig(gig._id)
      if (response.ok) {
        router.push("/view-gigs")
      } else {
        const data = await response.json()
        alert(data.message || "Failed to delete gig")
      }
    } catch (error) {
      console.error("Error deleting gig:", error)
      alert("An error occurred while deleting the gig")
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const statusConfig = getStatusConfig(gig.status)
  const StatusIcon = statusConfig.icon
  const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0

  return (
    <div className="space-y-6">
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your gig and remove all associated data from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Gig
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Details Card */}
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden sticky top-8">
        <div className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Project Details
          </p>

          <div className="space-y-4">
            {/* Budget */}
            {gig.budget && (
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-card-foreground font-medium">Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{gig.budget}</span>
                </div>
              </div>
            )}

            {/* Posted Date */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-card-foreground font-medium">Posted</span>
              </div>
              <span className="text-card-foreground font-semibold">{formatDate(gig.createdAt)}</span>
            </div>

            {/* Expiry Date */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-foreground" />
                <span className="text-card-foreground font-medium">Expires</span>
              </div>
              <span
                className={`font-semibold ${isExpiringSoon ? "text-accent-foreground" : "text-card-foreground"}`}
              >
                {formatDate(gig.expiresAt)}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <StatusIcon className="w-5 h-5 text-primary" />
                <span className="text-card-foreground font-medium">Status</span>
              </div>
              <Badge variant="outline" className={`${statusConfig.color} border font-semibold flex items-center gap-1.5 px-2.5 py-1`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 space-y-4">
            {/* About the Client */}
            {owner && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  About the Client
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Verification</span>
                    {owner.isVerified ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-none font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unverified</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                    <span className="text-sm font-semibold">{owner.createdAt ? new Date(owner.createdAt).getFullYear() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      Gigs Posted
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 cursor-help text-muted-foreground/70 hover:text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">The total number of gigs this client has posted on the platform.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    <span className="text-sm font-semibold">{owner.totalGigsPosted || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {user?.email !== gig.createdBy ? (
              <>
                {user?.role === "client" ? (
                  <div>
                    <button
                      onClick={() => {
                        toast.info("Please switch to Freelancer mode in the top navigation bar to apply for this gig.");
                      }}
                      className="w-full h-12 bg-secondary text-secondary-foreground border border-border hover:bg-muted font-bold text-sm rounded-xl flex items-center justify-center gap-2"
                    >
                      <Info className="w-4 h-4 text-primary" />
                      Switch to Freelancer to Apply
                    </button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      You are currently in Client mode.
                    </p>
                  </div>
                ) : canApply ? (
                  <>
                    {isPinged === true ? (
                      <button
                        disabled
                        className="w-full h-12 bg-muted text-muted-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!session) {
                            router.push("/auth/login")
                          } else {
                            router.push(
                              `/ping/ping-project?gigId=${gig._id}${owner ? `&posterId=${owner.id}` : ""}`,
                            )
                          }
                        }}
                        className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Apply for this Gig
                      </button>
                    )}
                  </>
                ) : (
                  <div>
                    <button
                      disabled
                      className="w-full h-12 bg-muted text-muted-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                      title={disabledMessage}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Apply for this Gig
                    </button>
                    {disabledMessage && (
                      <p className="text-sm text-muted-foreground mt-3 text-center bg-muted rounded-lg px-3 py-2">
                        {disabledMessage}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : null}

            {user?.email === gig.createdBy ? (
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/edit-gig/${gig._id}`)}
                  className="w-full h-12 bg-background text-primary border border-primary hover:bg-muted font-bold text-base rounded-xl flex items-center justify-center gap-2"
                >
                  <Pen className="w-5 h-5" />
                  Edit Gig
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full h-12 bg-destructive text-destructive-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Gig
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
