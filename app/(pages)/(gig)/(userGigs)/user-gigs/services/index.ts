import type { UserGig } from "../types"

export async function fetchUserGigs(cookieString: string = ""): Promise<{ gigs: UserGig[]; error: string | null; noProjects: boolean }> {
  const result = {
    gigs: [] as UserGig[],
    error: null as string | null,
    noProjects: false,
  }

  try {
    const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_LIVE_URL || 'http://localhost:3000') : '';
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    if (cookieString) {
      headers["Cookie"] = cookieString
    }

    const response = await fetch(`${baseUrl}/api/gigs/fetch-all-user-gigs`, {
      method: "POST",
      headers,
      cache: "no-store",
    })

    if (response.status === 204) {
      result.noProjects = true
      return result
    }

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `Failed to fetch user gigs: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.projects) {
      result.gigs = data.projects
      result.noProjects = data.projects.length === 0
    } else {
      result.noProjects = true
    }
  } catch (error) {
    console.error("Failed to fetch user gigs", error)
    result.error = error instanceof Error ? error.message : "Failed to load your gigs."
  }

  return result
}
