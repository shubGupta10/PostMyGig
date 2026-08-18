import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10 w-full min-w-0 max-w-full">
      <div className="max-w-7xl mx-auto space-y-8 w-full min-w-0">
        
        {/* Timeline Group 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-20" />
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-card rounded-2xl border-2 border-border shadow-xs p-5 sm:p-6"
              >
                <div className="flex items-center justify-between w-full gap-3 sm:gap-6">
                  {/* Left Column: Title, Status & Activity */}
                  <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="h-6 w-48 sm:w-64 max-w-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                  </div>

                  {/* Right Column: Budget */}
                  <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Group 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-24" />
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-card rounded-2xl border-2 border-border shadow-xs p-5 sm:p-6"
              >
                <div className="flex items-center justify-between w-full gap-3 sm:gap-6">
                  <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="h-6 w-40 sm:w-56 max-w-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                  </div>

                  <Skeleton className="h-9 w-20 rounded-xl shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
