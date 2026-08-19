import { ShieldAlert } from "lucide-react"
import type { RateLimitInfo } from "@/app/(pages)/(gig)/types"

interface RateLimitBannerProps {
  rateLimitInfo: RateLimitInfo
}

export function RateLimitBanner({ rateLimitInfo }: RateLimitBannerProps) {
  if (!rateLimitInfo.isLimited) return null

  return (
    <div className="mb-8 bg-accent border border-accent rounded-xl p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm">
          <ShieldAlert className="w-6 h-6 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-accent-foreground mb-2 text-lg">Rate Limit Exceeded</h4>
          <p className="text-muted-foreground leading-relaxed">{rateLimitInfo.message}</p>
          <div className="mt-3 text-sm text-accent-foreground bg-card rounded-lg p-3 shadow-sm">
            <strong>Tip:</strong> To avoid rate limits, try refreshing less frequently.
          </div>
        </div>
      </div>
    </div>
  )
}
