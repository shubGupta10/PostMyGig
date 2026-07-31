import { Loader2 } from "lucide-react"

export default function ApplicationsLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
