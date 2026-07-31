"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto mt-10">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Unable to Load Projects</h2>
          <p className="text-muted-foreground mb-8">
            {error.message || "An unexpected error occurred while loading your gigs."}
          </p>
          <button
            onClick={() => reset()}
            className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-sm transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
