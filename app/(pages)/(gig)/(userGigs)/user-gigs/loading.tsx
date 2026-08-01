import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-card rounded-2xl border-2 border-border shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between w-full gap-3 sm:gap-6">
                
                {/* Left Column: Title & Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <Skeleton className="h-6 w-56 max-w-full" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>

                {/* Right Column: Budget */}
                <div className="shrink-0">
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
