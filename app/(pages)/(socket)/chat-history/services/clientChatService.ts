export async function deleteChat(gigId: string, currentUserId: string): Promise<boolean> {
  const BackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

  try {
    const tokenRes = await fetch("/api/auth/token", { method: "POST" });
    const { token } = await tokenRes.json();

    const response = await fetch(`${BackendUrl}/api/v1/chat/delete-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ gigId, currentUserId }),
    })

    if (!response.ok) {
      throw new Error("Failed to delete chat")
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Delete Chat Error:", error)
    return false
  }
}
