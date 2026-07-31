import type { PingFormData } from "../types"

export async function submitPingService(formData: PingFormData): Promise<string> {
  const response = await fetch("/api/ping/ping-this-project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit application")
  }

  return result.message || "Application submitted successfully!"
}
