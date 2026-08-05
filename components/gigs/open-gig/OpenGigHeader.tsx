"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, CheckCircle, ArrowLeft, Eye, Users } from "lucide-react"
import type { Gig, Owner } from "@/app/(pages)/(gig)/types"
import { getStatusConfig, getTimeAgo, getDaysUntilExpiry } from "./utils"

interface OpenGigHeaderProps {
  gig: Gig
  owner: Owner | null
  isPinged: boolean
  canApply: boolean
  disabledMessage: string
}

export function OpenGigHeader({ gig, owner, isPinged, canApply, disabledMessage }: OpenGigHeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const statusConfig = getStatusConfig(gig.status)
  const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-transparent mb-6 sm:mb-8">
      <div>

        {/* Title and Status */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-6">

              {gig.isFlagged && (
                <Badge
                  variant="outline"
                  className="bg-destructive text-destructive-foreground border-none font-medium flex items-center gap-1.5 px-3 py-1"
                >
                  🚩 Flagged
                </Badge>
              )}
              {isExpiringSoon && (
                <Badge
                  variant="outline"
                  className="bg-secondary text-secondary-foreground border-none font-medium flex items-center gap-1.5 px-3 py-1"
                >
                  ⏰ Expiring Soon
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
              {gig.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-muted-foreground">
              <div className="flex items-center gap-3 bg-background/60 rounded-lg px-4 py-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground block">Posted</span>
                  <span className="font-semibold text-foreground">{getTimeAgo(gig.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-background/60 rounded-lg px-4 py-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground block">Expires</span>
                  <span className={`font-semibold ${isExpiringSoon ? "text-accent-foreground" : "text-foreground"}`}>
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left` : "Today"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-background/60 rounded-lg px-4 py-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground block">Posted by</span>
                  <span className="font-semibold text-foreground">{owner?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4 lg:w-auto w-full">
            {user?.email === gig.createdBy ? (
              <button
                className="bg-primary text-primary-foreground font-semibold h-11 w-full lg:w-auto px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                onClick={() => {
                  if (!session) {
                    router.push("/auth/login")
                  } else {
                    router.push(`/applications/view-applications?gigId=${gig._id}`)
                  }
                }}
              >
                <Users className="w-5 h-5" />
                View Applications
              </button>
            ) : (
              <>
                {canApply ? (
                  <>
                    {isPinged === true ? (
                      <button
                        disabled
                        className="bg-muted text-muted-foreground font-semibold h-11 w-full lg:w-auto px-6 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!session) {
                            router.push(`/auth/login?callbackUrl=/open-gig/${gig._id}`)
                          } else {
                            router.push(`/ping/ping-project?gigId=${gig._id}${owner ? `&posterId=${owner.id}` : ""}`)
                          }
                        }}
                        className="bg-primary text-primary-foreground font-semibold h-11 w-full lg:w-auto px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Apply Now
                      </button>
                    )}
                  </>
                ) : (
                  <div>
                    <button
                      disabled
                      className="bg-muted text-muted-foreground font-semibold h-11 w-full lg:w-auto px-6 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                      title={disabledMessage}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Apply Now
                    </button>
                    {disabledMessage && (
                      <p className="text-sm text-muted-foreground mt-2 text-center bg-background/60 rounded-lg px-3 py-2">
                        {disabledMessage}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
