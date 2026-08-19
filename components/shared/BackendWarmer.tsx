"use client"

import { useEffect } from "react"

export function BackendWarmer() {
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
    
    fetch(`${backendUrl}/`)
      .catch(() => {})
  }, [])

  return null
}
