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
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-5 w-48 sm:w-64 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-10 w-36 sm:w-44 rounded-xl shrink-0" />
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
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-5 w-40 sm:w-56 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32 sm:w-36 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
