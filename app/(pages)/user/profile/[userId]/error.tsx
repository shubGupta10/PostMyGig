"use client"

import { AlertTriangle } from "lucide-react"

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-destructive rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <AlertTriangle className="w-12 h-12 text-destructive-foreground" />
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
          {error.message || "Failed to load profile. Please try again."}
        </p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
