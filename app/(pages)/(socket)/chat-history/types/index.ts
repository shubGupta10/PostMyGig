export interface ChatData {
  _id: string
  senderId: string
  receiverId: string
  senderName: string
  senderEmail: string
  receiverName: string
  receiverEmail: string
  gigId: string
  gigTitle?: string
  chatType?: "GIG" | "DM"
  message: string
  timeStamp: string
  __v: number
}
