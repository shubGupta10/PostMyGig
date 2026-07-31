import { fetchGigs } from "@/app/(pages)/(gig)/services/gigApi"
import { GigCard } from "./gigs/GigCard"
import { RateLimitBanner } from "./gigs/RateLimitBanner"

export default async function DisplayAllGigs() {
  const result = await fetchGigs(1, 100)

  if (result.error) {
    throw new Error(result.error)
  }

  const gigs = result.gigs || []

  if (gigs.length === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 flex flex-col items-center justify-center">
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold text-foreground">No Gigs Found</h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We couldn't find any opportunities matching your criteria at the moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto pb-24 relative z-10">
        <RateLimitBanner rateLimitInfo={result.rateLimitInfo} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      </div>
    </div>
  )
}
