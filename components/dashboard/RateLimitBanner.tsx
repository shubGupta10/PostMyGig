"use client"

import { ShieldAlert } from "lucide-react"
import type { RateLimitInfo } from "@/app/(pages)/dashboard/types"

export function RateLimitBanner({ rateLimitInfo }: { rateLimitInfo: RateLimitInfo }) {
  if (!rateLimitInfo.isLimited) return null

  return (
    <div className="mb-6 bg-accent border border-border rounded-xl p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-accent-foreground mb-1 text-sm">Rate Limit Exceeded</h4>
          <p className="text-accent-foreground text-xs leading-relaxed">{rateLimitInfo.message}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            <strong>Tip:</strong> To avoid rate limits, try refreshing less frequently.
          </div>
        </div>
      </div>
    </div>
  )
}
