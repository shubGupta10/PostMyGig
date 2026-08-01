import { Eye } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Eye className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">Gig Not Found</h3>
          <p className="text-muted-foreground text-lg mb-8">
            The gig you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/view-gigs"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold transition-all duration-200 shadow-sm transform hover:-translate-y-1"
          >
            Back to Gigs
          </Link>
        </div>
      </div>
    </div>
  )
}
