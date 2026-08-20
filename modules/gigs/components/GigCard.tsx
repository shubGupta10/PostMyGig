"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share, Copy, MessageCircle, Star, Calendar, Clock, Eye, ChevronRight, Zap, Award } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Gig } from "@/app/(pages)/(gig)/types"
import { useCallback, useMemo } from "react"

interface GigCardProps {
  gig: Gig
  showSkills?: boolean
}

export function GigCard({ gig, showSkills = true }: GigCardProps) {
  const router = useRouter()

  const getShareUrl = useCallback((gigId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:3000"
    return `${baseUrl}/open-gig/${gigId}`
  }, [])

  const handleCopyLink = useCallback(
    async (gigId: string) => {
      const url = getShareUrl(gigId)
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    },
    [getShareUrl],
  )

  const handleWhatsAppShare = useCallback(
    (gigId: string, title: string) => {
      const url = getShareUrl(gigId)
      const text = `Check out this gig: ${title}`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
      window.open(whatsappUrl, "_blank")
    },
    [getShareUrl],
  )

  const handleXShare = useCallback(
    (gigId: string, title: string) => {
      const url = getShareUrl(gigId)
      const text = `Check out this gig: ${title}`
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${url}`)}`
      window.open(xUrl, "_blank")
    },
    [getShareUrl],
  )

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [])

  const getTimeAgo = useCallback(
    (dateString: string) => {
      const now = new Date()
      const date = new Date(dateString)
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Just now"
      if (diffInHours < 24) return `${diffInHours}h ago`
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d ago`
      return formatDate(dateString)
    },
    [formatDate],
  )


  return (
    <div className="group bg-card rounded-2xl border-2 border-border shadow-sm hover:border-primary transition-colors flex flex-col h-full overflow-hidden">
      <div className="p-6 flex flex-col h-full">

        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-muted text-muted-foreground font-medium text-xs px-2.5 py-1 border border-border">
              Posted {getTimeAgo(gig.createdAt)}
            </Badge>

            {gig.isFlagged && (
              <Badge variant="outline" className="bg-accent text-accent-foreground border-accent font-medium text-xs px-2.5 py-1">
                Flagged
              </Badge>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="p-2 border border-border bg-muted hover:bg-accent text-foreground rounded-lg transition-colors cursor-pointer shrink-0">
                <Share className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-2 border-border shadow-sm rounded-2xl p-0 overflow-hidden">
              <div className="bg-muted p-6">
                <DialogHeader className="space-y-3">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center mx-auto border border-border shadow-sm">
                    <Share className="w-5 h-5 text-primary" />
                  </div>
                  <DialogTitle className="text-xl font-bold text-center text-foreground">
                    Share This Gig
                  </DialogTitle>
                  <DialogDescription className="text-center text-sm text-muted-foreground">
                    Spread the word about this opportunity.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mt-6">
                  <Button onClick={() => handleCopyLink(gig._id)} variant="outline" className="w-full justify-start gap-3 h-12 bg-card hover:bg-accent border-border rounded-xl shadow-sm text-sm font-medium cursor-pointer">
                    <Copy className="w-4 h-4 text-primary" />
                    Copy Link
                  </Button>
                  <Button onClick={() => handleWhatsAppShare(gig._id, gig.title)} variant="outline" className="w-full justify-start gap-3 h-12 bg-card hover:bg-accent border-border rounded-xl shadow-sm text-sm font-medium cursor-pointer">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    Share on WhatsApp
                  </Button>
                  <Button onClick={() => handleXShare(gig._id, gig.title)} variant="outline" className="w-full justify-start gap-3 h-12 bg-card hover:bg-accent border-border rounded-xl shadow-sm text-sm font-medium cursor-pointer">
                    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share on X
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Title and Description */}
        <div className="space-y-2 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2">{gig.title}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {gig.description}
          </p>
        </div>

        {/* Skills */}
        {showSkills && gig.skillsRequired && gig.skillsRequired.length > 0 && (
          <div className="mt-auto mb-6">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Required Skills
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {gig.skillsRequired.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-xl border border-transparent">
                  {skill}
                </span>
              ))}
              {gig.skillsRequired.length > 3 && (
                <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-xl border border-transparent">
                  +{gig.skillsRequired.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer: CTA */}
        <div className={!showSkills || !gig.skillsRequired || gig.skillsRequired.length === 0 ? "mt-auto" : ""}>
          <button onClick={() => router.push(`/open-gig/${gig._id}`)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold transition-colors shadow-sm text-sm cursor-pointer" aria-label={`View details for ${gig.title}`}>
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  )
}
