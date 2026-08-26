"use client"

import Link from "next/link"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RateClientDialog } from "@/modules/gigs/components/RateClientDialog"
import { ExpandableText } from "@/components/ui/expandable-text"
import {
  FileText,
  MessageSquare,
  X,
  Calendar,
  Tag,
  Wallet,
  ClipboardList,
  Eye,
} from "lucide-react"
import type { AppliedPingHistory } from "@/app/(pages)/dashboard/types"

interface ProposalDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: AppliedPingHistory & { updatedAt?: string }
  displayStatus: string
  activityText: string
}


export function ProposalDrawer({
  open,
  onOpenChange,
  item,
  displayStatus,
  activityText,
}: ProposalDrawerProps) {
  const isActive = ["accepted", "contract_offered", "in_progress"].includes(
    item.status.toLowerCase()
  )
  const isCompleted = item.projectDetails?.status?.toLowerCase() === "completed"

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex flex-col h-full max-w-xl w-full ml-auto">
        {/* Header */}
        <DrawerHeader className="flex-none border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <DrawerTitle className="text-lg font-semibold text-foreground leading-snug">
                {item.projectDetails?.title || "Gig Details"}
              </DrawerTitle>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <Badge className="bg-primary text-primary-foreground capitalize text-xs font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                  {displayStatus.replace(/_/g, " ")}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Applied: {new Date(item.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
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
              {item.projectDetails?.category && (
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {item.projectDetails.category}
                    </p>
                  </div>
                </div>
              )}
              {item.projectDetails?.budget && (
                <div className="flex items-center gap-3">
                  <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium text-foreground">
                      {item.projectDetails.budget}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Activity</p>
                  <p className="text-sm font-medium text-foreground">{activityText}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Proposal Message */}
          {item.message && (
            <section className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Proposal Message
              </p>
              <div className="bg-muted/40 rounded-xl p-5 border border-border">
                <ExpandableText 
                  text={item.message} 
                  className="text-sm text-foreground whitespace-pre-wrap min-w-0 break-words" 
                />
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-none border-t border-border px-4 sm:px-6 py-4 flex flex-row flex-nowrap sm:justify-end gap-2.5 bg-card w-full overflow-x-auto no-scrollbar">
          {isActive ? (
            <>
              <Button
                asChild
                variant="outline"
                className="flex-none w-auto h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl border-border whitespace-nowrap"
              >
                <Link
                  href={`/contracts/${item.projectId}?freelancerEmail=${item.userEmail}`}
                >
                  <FileText className="w-4 h-4 mr-1.5 shrink-0" />
                  View Contract
                </Link>
              </Button>
              <Button
                asChild
                className="flex-none w-auto h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-primary-foreground whitespace-nowrap"
              >
                <Link href={`/projects/${item.projectId}/huddle`}>
                  <MessageSquare className="w-4 h-4 mr-1.5 shrink-0" />
                  Open Project Huddle
                </Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="secondary"
              className="flex-none w-auto h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap"
            >
              <Link href={`/open-gig/${item.projectId}`}>
                <Eye className="w-4 h-4 mr-1.5 shrink-0" />
                View Gig Listing
              </Link>
            </Button>
          )}
          {isCompleted && (
            <div className="w-auto">
              <RateClientDialog gigId={item.projectId} />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
