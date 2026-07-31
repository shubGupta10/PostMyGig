export interface Applyer {
  _id: string
  name: string
  email: string
  profilePhoto?: string
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
