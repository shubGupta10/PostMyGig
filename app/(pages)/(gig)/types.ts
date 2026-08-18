export interface Gig {
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
  displayContactLinks?: boolean
  contact?: {
    email?: string
    whatsapp?: string
    x?: string
  }
  budget?: number
  updatedAt?: string
  isCurated?: boolean
}

export interface Owner {
  id: string
  name: string
  email: string
  isVerified: boolean;
  createdAt: string;
  totalGigsPosted?: number;
}

export interface PaginationData {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface RateLimitInfo {
  isLimited: boolean
  retryAfter: string | null
  message: string
  timestamp: number
}

export interface FetchGigsResult {
  gigs: Gig[]
  pagination: PaginationData
  rateLimitInfo: RateLimitInfo
  error: string | null
}
