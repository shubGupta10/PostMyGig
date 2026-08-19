"use client"

import { useEffect } from "react"
import { AlertCircle, ShieldAlert, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isRateLimit = error.message.includes("Rate limit exceeded")

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 text-foreground shadow-sm">
            {isRateLimit ? <ShieldAlert className="w-8 h-8" /> : <AlertCircle className="w-8 h-8 text-destructive" />}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
            {isRateLimit ? "Rate Limit Exceeded" : "Oops! Something went wrong"}
          </h3>
          <p className="text-muted-foreground max-w-md text-sm font-normal mb-8 leading-relaxed">
            {error.message || "We encountered an unexpected error while fetching the dashboard."}
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
  )
}
