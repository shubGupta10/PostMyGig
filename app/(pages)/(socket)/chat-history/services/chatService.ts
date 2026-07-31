import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import type { ChatData } from "../types"

export async function fetchChatHistory(): Promise<ChatData[]> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in to view messages.")
  }

  const BackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!

  try {
    const response = await fetch(`${BackendUrl}/api/v1/chat/fetch-all-chat-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ currentUserId: session.user.id }),
      cache: "no-store"
    })

    if (!response.ok) {
      throw new Error("Failed to fetch chat history from server.")
    }

    const responseData = await response.json()
    return responseData.chat || []
  } catch (error) {
    console.error("Chat Service Error:", error)
    throw new Error("Failed to load chat history. Please try again.")
  }
}
