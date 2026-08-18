import { ReactNode } from "react"

export interface ActivityMetadata {
  clientName?: string
  freelancerName?: string
  FullName?: string
  gigTitle?: string
  skills?: string[]
  budget?: string
}

export interface LandingActivityItem {
  _id: string
  userId?: string
  gigId?: string
  type: "posted" | "applied" | "hired" | "completed" | string
  metadata?: ActivityMetadata
  createdAt: string | Date
}

export interface TestimonialItem {
  id: number
  name: string
  role: string
  location: string
  avatar: string
  feedback: string
  rating: number
}

export interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  className?: string
}

export type LandingFeedbackTab = "testimonials" | "live-activity"


