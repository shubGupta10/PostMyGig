export interface PortfolioProject {
  title: string
  description: string
  tags: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface MatchDetails {
  score: number
  matchingSkills: string[]
  matchingProjects: string[]
  hasLiveProof: boolean
  isTopMatch: boolean
}

export interface Applyer {
  _id: string
  name: string
  email: string
  profilePhoto?: string
  bio?: string
  skills?: string[]
  portfolioProjects?: PortfolioProject[]
  isVerified?: boolean
}

export interface Application {
  _id: string
  projectId: string
  userEmail: string
  posterEmail?: string
  message: string
  bestWorkLink: string
  status: string
  bestWorkDescription: string
  createdAt: string
  updatedAt: string
  applicant: Applyer
  matchDetails?: MatchDetails
}

export interface ContactLink {
  label: string
  url: string
  _id: string
}

export interface ContactData {
  email: string
  contactLinks: ContactLink[]
}

export interface GigDetails {
  title: string
  skillsRequired: string[]
}
