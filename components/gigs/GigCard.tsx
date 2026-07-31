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
}

export function GigCard({ gig }: GigCardProps) {
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

  const getDaysUntilExpiry = useCallback((dateString: string) => {
    const now = new Date()
    const expiry = new Date(dateString)
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffInDays
  }, [])

  const getStatusConfig = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-accent text-accent-foreground border-accent",
          dot: "bg-green-500",
          icon: Zap,
          borderColor: "border-primary",
        }
      case "completed":
        return {
          color: "bg-secondary text-secondary-foreground border-secondary",
          dot: "bg-primary",
          icon: Award,
          borderColor: "border-primary",
        }
      case "expired":
        return {
          color: "bg-destructive text-destructive-foreground border-destructive",
          dot: "bg-background",
          icon: Clock,
          borderColor: "border-destructive",
        }
      case "accepted":
        return {
          color: "bg-primary text-primary-foreground border-primary",
          dot: "bg-background",
          icon: Award,
          borderColor: "border-primary",
        }
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          dot: "bg-muted-foreground",
          icon: Clock,
          borderColor: "border-border",
        }
    }
  }, [])

  const statusConfig = getStatusConfig(gig.status)
  const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt)
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0
  const StatusIcon = statusConfig.icon

  return (
    <div className={`group bg-card rounded-3xl border-t-4 ${statusConfig.borderColor} border-l border-r border-b border-border hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[500px] sm:min-h-[520px] lg:min-h-[540px]`}>
      <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className={`${statusConfig.color} font-semibold text-sm px-4 py-2 flex items-center gap-2 flex-shrink-0 w-fit`}>
              <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
              <StatusIcon className="w-4 h-4" />
              {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
            </Badge>

            {gig.isFlagged && (
              <Badge variant="outline" className="bg-accent text-accent-foreground border-accent font-semibold text-sm px-3 py-1 w-fit">
                🚩 Flagged
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge variant="outline" className="bg-destructive text-destructive-foreground border-destructive font-semibold text-sm px-3 py-1 w-fit">
                ⏰ Expiring
              </Badge>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="px-3 py-3 bg-secondary hover:bg-secondary text-secondary-foreground rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer flex-shrink-0">
                <Share className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-card border-border shadow-2xl backdrop-blur-sm rounded-3xl p-0 overflow-hidden">
              <div className="bg-muted p-8">
                <DialogHeader className="space-y-4">
                  <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Share className="w-8 h-8 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center text-foreground">
                    Share This Gig
                  </DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground text-base leading-relaxed">
                    Spread the word about this opportunity with your network using the options below.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-8">
                  <Button onClick={() => handleCopyLink(gig._id)} variant="outline" className="w-full justify-start gap-4 h-14 bg-card hover:bg-accent hover:text-accent-foreground border-border hover:border-accent transition-all duration-200 rounded-xl shadow-sm hover:shadow-md text-base font-semibold cursor-pointer">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center ">
                      <Copy className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Copy Link</div>
                      <div className="text-sm text-muted-foreground">Copy URL to clipboard</div>
                    </div>
                  </Button>

                  <Button onClick={() => handleWhatsAppShare(gig._id, gig.title)} variant="outline" className="w-full justify-start gap-4 h-14 bg-card hover:bg-accent hover:text-accent-foreground border-border hover:border-accent transition-all duration-200 rounded-xl shadow-sm hover:shadow-md text-base font-semibold cursor-pointer">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Share on WhatsApp</div>
                      <div className="text-sm text-muted-foreground">Send to your contacts</div>
                    </div>
                  </Button>

                  <Button onClick={() => handleXShare(gig._id, gig.title)} variant="outline" className="w-full justify-start gap-4 h-14 bg-card hover:bg-accent hover:text-accent-foreground border-border hover:border-accent transition-all duration-200 rounded-xl shadow-sm hover:shadow-md text-base font-semibold cursor-pointer">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Share on X</div>
                      <div className="text-sm text-muted-foreground">Post to your timeline</div>
                    </div>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary leading-tight line-clamp-2">{gig.title}</h2>

          <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">
            {gig.description.length > 140 ? `${gig.description.substring(0, 140)}...` : gig.description}
          </p>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-secondary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">Required Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {gig.skillsRequired.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary transition-colors duration-200 px-3 py-1.5 font-medium border border-secondary">
                  {skill.trim()}
                </Badge>
              ))}
              {gig.skillsRequired.length > 4 && (
                <Badge variant="secondary" className="text-sm bg-muted text-muted-foreground border border-border px-3 py-1.5 font-medium">
                  +{gig.skillsRequired.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-center text-sm text-muted-foreground bg-muted rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-card rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-3 h-3" />
              </div>
              <span className="font-medium">Posted {getTimeAgo(gig.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-card rounded-lg flex items-center justify-center shadow-sm">
                <Clock className="w-3 h-3" />
              </div>
              <span className={`font-medium ${isExpiringSoon ? "text-destructive" : ""}`}>
                {daysUntilExpiry > 0 ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left` : "Expires today"}
              </span>
            </div>
          </div>

          <button onClick={() => router.push(`/open-gig/${gig._id}`)} className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary text-primary-foreground rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg cursor-pointer">
            <Eye className="w-5 h-5" />
            <span>View Details</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
