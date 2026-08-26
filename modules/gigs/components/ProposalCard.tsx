"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Eye } from "lucide-react"
import { ProposalDrawer } from "./ProposalDrawer"
import type { AppliedPingHistory } from "@/app/(pages)/dashboard/types"

interface ProposalCardProps {
  item: AppliedPingHistory & { updatedAt?: string }
  displayStatus: string
  activityText: string
}

export function ProposalCard({ item, displayStatus, activityText }: ProposalCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-xs hover:bg-accent/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
      >
        {/* Left: title + badge + date */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {item.projectDetails?.title || "Gig Details"}
            </h3>
            <Badge className="bg-secondary text-secondary-foreground border border-border capitalize text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0">
              {displayStatus.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{activityText}</span>
          </div>
        </div>

        {/* Right: view details button */}
        <div className="shrink-0">
          <div className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-secondary text-sm font-semibold group-hover:opacity-90 transition-opacity">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </div>
        </div>
      </button>

      <ProposalDrawer
        open={open}
        onOpenChange={setOpen}
        item={item}
        displayStatus={displayStatus}
        activityText={activityText}
      />
    </>
  )
}
