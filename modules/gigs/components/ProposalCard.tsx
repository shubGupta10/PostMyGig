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
        className="w-full text-left bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-sm transition-all flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 group cursor-pointer"
      >
        {/* Left: title + date */}
        <div className="flex flex-col justify-center space-y-2 min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {item.projectDetails?.title || "Gig Details"}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{activityText}</span>
          </div>
        </div>

        {/* Right: status + view details button */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
          <Badge className="w-fit bg-secondary text-secondary-foreground border border-border capitalize text-xs font-medium px-3 py-0.5 rounded-full">
            {displayStatus.replace(/_/g, " ")}
          </Badge>
          <div className="flex items-center justify-center gap-2 h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-primary text-secondary text-xs sm:text-sm font-semibold group-hover:opacity-90 transition-opacity">
            <Eye className="w-4 h-4 shrink-0" />
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
