import type { FeedbackPayload } from "../types"

export async function submitFeedbackService(payload: FeedbackPayload) {
  const response = await fetch("/api/user/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit feedback.")
  }

  return data
}
