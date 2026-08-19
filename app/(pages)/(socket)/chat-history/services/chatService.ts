import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import type { ChatData } from "../types"
import jwt from "jsonwebtoken"

export async function fetchChatHistory(): Promise<ChatData[]> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in to view messages.")
  }

  const BackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!

  try {

    const token = jwt.sign(
      { id: session.user.id, email: session.user.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "1h" }
    )

    const response = await fetch(`${BackendUrl}/api/v1/chat/fetch-all-chat-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
