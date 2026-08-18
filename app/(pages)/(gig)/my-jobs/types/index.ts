export interface UserGig {
  _id: string
  title: string
  description: string
  budget: string
  skillsRequired: string[]
  status: string
  createdAt: string
  expiresAt: string
  AcceptedFreelancerEmail?: string
  isCurated?: boolean
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FetchUserGigsResult {
  gigs: UserGig[]
  pagination: PaginationInfo | null
  error: string | null
  noProjects: boolean
}
