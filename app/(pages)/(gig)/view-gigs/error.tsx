"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

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
    <div className="w-full min-h-[50vh] bg-background relative overflow-hidden flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mb-8 shadow-xl">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-foreground">Oops! Something went wrong</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {error.message || "We encountered an unexpected error while fetching the gigs."}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-primary hover:bg-primary shadow-xl hover:shadow-2xl text-primary-foreground rounded-xl transition-all duration-200 font-semibold text-lg cursor-pointer"
        >
          <RefreshCw className="w-6 h-6" />
          Try Again
        </button>
      </div>
    </div>
  )
}
