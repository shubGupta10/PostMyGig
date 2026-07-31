import type { FetchGigsResult, RateLimitInfo } from "../types"

export async function fetchGigs(page = 1, limit = 6): Promise<FetchGigsResult> {
  const result: FetchGigsResult = {
    gigs: [],
    pagination: {
      page: 1,
      limit: 6,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    rateLimitInfo: {
      isLimited: false,
      retryAfter: null,
      message: "",
      timestamp: 0,
    },
    error: null,
  }

  try {
    const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_LIVE_URL || 'http://localhost:3000') : '';
    const response = await fetch(`${baseUrl}/api/gigs/fetch-gigs?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || "60"
      const rateLimitMessage = `Rate limit exceeded. Too many requests. Please wait ${retryAfter} seconds before trying again.`

      result.rateLimitInfo = {
        isLimited: true,
        retryAfter,
        message: rateLimitMessage,
        timestamp: Date.now(),
      }
      result.error = rateLimitMessage
      return result
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch gigs: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    result.gigs = data.gigs || []
    result.pagination = {
      page: data.page,
      limit: data.limit,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
    }
  } catch (error) {
    console.error("Failed to fetch gigs", error)
    result.error = error instanceof Error ? error.message : "Failed to load gigs. Please try again later."
  }

  return result
}

export async function fetchUserGigs(cookieString: string = ""): Promise<{ gigs: any[]; error: string | null; noProjects: boolean }> {
  const result = {
    gigs: [],
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

