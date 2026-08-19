import { Skeleton } from "@/components/ui/skeleton"

export function GigListSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Filters Bar Skeleton */}
      <div className="w-full flex flex-col gap-4">
        {/* Search input */}
        <div className="relative w-full">
          <Skeleton className="h-10 w-full rounded-lg border-2 border-border" />
        </div>

        {/* Skill dropdown and Sort dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-10 w-36 sm:w-40 rounded-lg border-2 border-border" />
          <Skeleton className="h-10 w-36 sm:w-40 rounded-lg border-2 border-border" />
        </div>
      </div>

      {/* Gigs Grid Skeleton matching DisplayAllGigs 3x3 layout */}
      <div className="w-full relative overflow-hidden">
        <div className="max-w-7xl mx-auto pb-12 sm:pb-24 relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border-2 border-border shadow-sm flex flex-col h-full overflow-hidden"
              >
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    {/* Header Row: Posted Badge & Share button */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <Skeleton className="h-6 w-28 rounded-md" />
                      <Skeleton className="size-8 rounded-lg shrink-0" />
                    </div>

                    {/* Title and 2-line Description */}
                    <div className="space-y-2 mb-6">
                      <Skeleton className="h-6 w-4/5 rounded-md" />
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                  </div>

                  {/* Skills Section and CTA Button */}
                  <div className="space-y-6 mt-auto">
                    <div>
                      <Skeleton className="h-3 w-24 rounded-md mb-3" />
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-7 w-20 rounded-xl" />
                        <Skeleton className="h-7 w-16 rounded-xl" />
                        <Skeleton className="h-7 w-24 rounded-xl" />
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
