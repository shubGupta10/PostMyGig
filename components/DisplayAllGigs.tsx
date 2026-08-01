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
      <div className="w-full bg-background relative overflow-hidden py-12 sm:py-20 rounded-2xl border border-dashed border-border flex items-center justify-center">
        <div className="text-center space-y-4 max-w-lg mx-auto p-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">No Gigs Found</h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We couldn't find any opportunities matching your criteria at the moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto pb-12 sm:pb-24 relative z-10 space-y-6">
        <RateLimitBanner rateLimitInfo={result.rateLimitInfo} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      </div>
    </div>
  )
}
