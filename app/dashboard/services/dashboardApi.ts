import type { FetchDashboardResult } from "../types"

export async function fetchDashboardDetails(cookieString?: string): Promise<FetchDashboardResult> {
  try {
    const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_LIVE_URL || 'http://localhost:3000') : '';
    
    const headers: HeadersInit = {}
    if (cookieString) {
      headers['Cookie'] = cookieString
    }

    const res = await fetch(`${baseUrl}/api/dashboard/details`, {
      method: "POST",
      headers,
    })

    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After") || "60"
      const rateLimitMessage = `Rate limit exceeded. Too many requests. Please wait ${retryAfter} seconds before trying again.`

      return {
        data: null,
        rateLimitInfo: {
          isLimited: true,
          retryAfter,
          message: rateLimitMessage,
          timestamp: Date.now(),
        },
        error: rateLimitMessage,
      }
    }

    const data = await res.json()

    if (res.ok && data.dashboard) {
      return {
        data: data.dashboard,
        rateLimitInfo: {
          isLimited: false,
          retryAfter: null,
          message: "",
          timestamp: 0,
        },
        error: null,
      }
    }

    return {
      data: null,
      rateLimitInfo: {
        isLimited: false,
        retryAfter: null,
        message: "",
        timestamp: 0,
      },
      error: data.message || "Failed to load dashboard. Please try again later.",
    }
  } catch (error) {
    console.error("Error fetching dashboard details:", error)
    return {
      data: null,
      rateLimitInfo: {
        isLimited: false,
        retryAfter: null,
        message: "",
        timestamp: 0,
      },
      error: "Failed to load dashboard. Please try again later.",
    }
  }
}
