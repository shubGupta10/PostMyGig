export interface ActivityMetadata {
  clientName?: string
  freelancerName?: string
  FullName?: string // backward compatibility
  gigTitle: string
  skills?: string[]
  budget?: string
}

export interface ActivityItem {
  _id: string
  userId: string
  gigId: string
  type: 'posted' | 'applied' | 'hired' | 'completed' | string
  metadata: ActivityMetadata
  createdAt: string
}
