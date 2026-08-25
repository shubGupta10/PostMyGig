import { PortfolioProject } from "@/modules/users/models/UserModel"

export interface ContactLinks {
  label: string
  url: string
}

export interface ReviewData {
  _id: string;
  gigId: string;
  authorId: string;
  targetId: string;
  role: "client" | "freelancer";
  rating: number;
  comment: string;
  status: "hidden" | "published";
  createdAt: string;
  updatedAt: string;
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
  averageRating?: number;
  totalReviews?: number;
  reviews?: ReviewData[];
  completedGigs?: any[]
  portfolioProjects?: PortfolioProject[]
}
