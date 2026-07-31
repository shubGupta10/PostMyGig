export interface ActivityMetadata {
  FullName: string
  gigTitle: string
}

export interface ActivityItem {
  _id: string
  userId: string
  gigId: string
  type: string
  metadata: ActivityMetadata
  createdAt: string
}
