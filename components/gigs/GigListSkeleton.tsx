import { Skeleton } from "@/components/ui/skeleton"

export function GigListSkeleton() {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden min-h-[500px] sm:min-h-[520px] lg:min-h-[540px]"
            >
              <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-11 w-11 rounded-xl" />
                </div>

                <div className="space-y-6">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-24 w-full" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-8 w-20 rounded-xl" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
