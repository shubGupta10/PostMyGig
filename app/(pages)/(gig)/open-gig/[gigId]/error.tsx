"use client"

import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="bg-card border-2 border-destructive/20 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
        <button onClick={reset} className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity">
          Try again
        </button>
      </div>
    </div>
  )
}
