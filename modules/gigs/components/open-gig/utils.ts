import { CheckCircle, Clock, Star, Users, Briefcase } from "lucide-react"

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const getTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just posted"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return formatDate(dateString)
}

export const getDaysUntilExpiry = (dateString: string) => {
  const now = new Date()
  const expiry = new Date(dateString)
  const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays
}

export const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        color: "bg-primary text-primary-foreground border-primary",
        icon: CheckCircle,
      }
    case "completed":
      return {
        color: "bg-secondary text-secondary-foreground border-border",
        icon: Star,
      }
    case "expired":
      return {
        color: "bg-destructive text-destructive-foreground border-destructive",
        icon: Clock,
      }
    case "accepted":
      return {
        color: "bg-primary text-primary-foreground border-primary",
        icon: Users,
      }
    default:
      return {
        color: "bg-muted text-foreground border-border",
        icon: Briefcase,
      }
  }
}

export const isGigAvailableForApplication = (status: string, expiresAt: string) => {
  const statusLower = status.toLowerCase()
  const now = new Date()
  const expiry = new Date(expiresAt)
  const isExpired = now > expiry
  return statusLower === "active" && !isExpired
}

export const getDisabledButtonMessage = (status: string, expiresAt: string) => {
  const statusLower = status.toLowerCase()
  const now = new Date()
  const expiry = new Date(expiresAt)
  const isExpired = now > expiry

  if (isExpired) return "This gig has expired"
  if (statusLower === "completed") return "This gig has been completed"
  if (statusLower === "accepted") return "This gig has been accepted"
  return ""
}
