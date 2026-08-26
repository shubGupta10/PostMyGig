import { Skeleton } from "@/components/ui/skeleton"

export default function ProposalsLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10 w-full min-w-0 max-w-full">
      <div className="max-w-7xl mx-auto space-y-8 w-full min-w-0">
        
        {/* Section 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-20" />
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between gap-4 sm:gap-6"
              >
                <div className="flex flex-col justify-center space-y-2 min-w-0 flex-1">
                  <Skeleton className="h-5 sm:h-6 w-48 sm:w-64 rounded-md" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-9 sm:h-10 w-32 sm:w-36 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-24" />
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between gap-4 sm:gap-6"
              >
                <div className="flex flex-col justify-center space-y-2 min-w-0 flex-1">
                  <Skeleton className="h-5 sm:h-6 w-40 sm:w-56 rounded-md" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-3.5 w-24 rounded-md" />
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-9 sm:h-10 w-32 sm:w-36 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
