export interface UserType {
  _id: string
  name: string
  email: string
  role: string
  profilePhoto?: string
  bio?: string
  location?: string
  skills?: string[]
  contactLinks?: Array<{ label: string; url: string; _id: string }>
  isBanned?: boolean
  isVerified?: boolean
  reportCount?: number
  createdAt: string
  updatedAt?: string
  provider?: string
}

export interface AdminProject {
  _id: string
  title: string
  description: string
  createdBy: string
  budget: string
  AcceptedFreelancerEmail?: string
  skillsRequired?: string[]
  status: string
  expiresAt?: string
  reportCount?: number
  isFlagged?: boolean
  isCurated?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Feedback {
  _id: string
  name: string
  email: string
  feedback: string
  feedbackType: string
  submittedAt: string
  createdAt?: string
  updatedAt?: string
}

export interface VerificationRequest {
  _id: string
  name: string
  email: string
  role: string
  profilePhoto?: string
  completedGigs?: Array<{
    _id: string
    title: string
    budget: string
  }>
}

export interface DashboardData {
  counts: {
    totalUsers: number
    totalProjects: number
    totalPingSends: number
  }
  allData: {
    totalUsersData: UserType[]
    totalProjectsData: AdminProject[]
    fetchALLFeedbacks: Feedback[]
  }
  pagination: {
    userPagination: {
      page: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    projectPagination: {
      page: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    feedbackPagination: {
      page: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}
