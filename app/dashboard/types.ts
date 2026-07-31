export interface Project {
  _id: string
  title: string
  description: string
  skillsRequired: string[]
  status: string
  createdAt: string
  expiresAt: string
  createdBy: string
  isFlagged: boolean
  reportCount: number
}

export interface DashboardProps {
  projects: Project[]
  totalPings: number
  totalProjects: number
}

export interface RateLimitInfo {
  isLimited: boolean
  retryAfter: string | null
  message: string
  timestamp: number
}

export interface FetchDashboardResult {
  data: DashboardProps | null
  rateLimitInfo: RateLimitInfo
  error: string | null
}
