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
}
