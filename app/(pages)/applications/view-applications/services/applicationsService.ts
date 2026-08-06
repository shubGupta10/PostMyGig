import type { Application, ContactData } from "../types"

export async function fetchApplicationsService(gigId: string): Promise<{
  applications: Application[]
  posterEmail: string | null
}> {
  const response = await fetch(`/api/applications/fetch-applications?gigId=${gigId}`)
  const data = await response.json()

  if (!response.ok || !data.data || !Array.isArray(data.data)) {
    return { applications: [], posterEmail: null }
  }

  return {
    applications: data.data,
    posterEmail: data.data.length > 0 ? data.data[0].posterEmail : null,
  }
}

export async function acceptApplicationService(
  applicationId: string,
  applicantEmail: string,
  gigId: string
): Promise<void> {
  const response = await fetch("/api/applications/accept-application", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId, applicantEmail, gigId }),
  })
  if (!response.ok) throw new Error("Failed to accept applicant")
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("refresh-notification"))
  }
}

export async function deleteApplicationService(applicationId: string): Promise<void> {
  const response = await fetch("/api/applications/delete-applications", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId }),
  })
  if (!response.ok) throw new Error("Error deleting application")
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("refresh-notification"))
  }
}

export async function fetchContactDetailsService(applicantEmail: string): Promise<ContactData> {
  const res = await fetch("/api/applications/contact-applicant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicantEmail }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to contact applicant")
  return {
    email: data.contactDetails.email,
    contactLinks: data.contactDetails.contactLinks || [],
  }
}
