"use client"

import { Zap } from "lucide-react"

export default function ActivityError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-destructive/20">
            <Zap className="size-8 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Failed to load activity</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {error.message || "Something went wrong while connecting to the database."}
          </p>
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
