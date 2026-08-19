import { PortfolioProject } from "@/modules/users/models/UserModel"

export interface ContactLinks {
  label: string
  url: string
}

export interface UserData {
  _id: string
  name: string
  email: string
  bio: string
  contactLinks: ContactLinks[]
  createdAt: string
  updatedAt: string
  isBanned: boolean
  location: string
  profilePhoto: string
  provider: string
  reportCount: number
  role: "freelancer" | "client" | "admin"
  skills: string[]
  activityPublic?: boolean
  showEmail?: boolean
  showContactLinks?: boolean
  isVerified: boolean
  openGigs?: any[]
  completedGigs?: any[]
  portfolioProjects?: PortfolioProject[]
}
