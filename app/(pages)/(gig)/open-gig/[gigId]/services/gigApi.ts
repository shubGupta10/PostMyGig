import type { Gig, Owner } from "../../../types"

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_LIVE_URL || 'http://localhost:3000';
};

export async function fetchGigDetails(gigId: string, cookieString?: string) {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (cookieString) {
      headers['Cookie'] = cookieString
    }

    const res = await fetch(`${getBaseUrl()}/api/gigs/open-gigs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ gigId }),
    })

    const data = await res.json()

    if (res.ok && data.gig) {
      return { gig: data.gig as Gig, owner: data.owner as Owner, error: null }
    } else {
      return { gig: null, owner: null, error: data.message || data.error || "Failed to fetch gig" }
    }
  } catch (error) {
    console.error("Error fetching gig:", error)
    return { gig: null, owner: null, error: "Network error. Please check your connection and try again." }
  }
}

export async function checkPingStatus(gigId: string, userEmail: string, cookieString?: string) {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (cookieString) {
      headers['Cookie'] = cookieString
    }

    const res = await fetch(`${getBaseUrl()}/api/ping/check-if-pinged`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userEmail, projectId: gigId }),
    })
    
    if (res.ok) {
      const data = await res.json()
      return data.pinged
    }
    return false
  } catch (error) {
    console.error("Error checking ping status:", error)
    return false
  }
}

export async function deleteGig(gigId: string) {
  return await fetch(`/api/gigs/open-gigs`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gigId }),
  })
}

export async function updateContactVisibility(gigId: string, displayContactLinks: boolean) {
  return await fetch(`/api/gigs/open-gigs`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gigId, displayContactLinks }),
  })
}
