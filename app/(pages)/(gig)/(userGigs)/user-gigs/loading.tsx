import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-3" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-6 sm:pr-4">
                
                <div className="flex-1 min-w-0 w-full space-y-3">
                  <Skeleton className="h-6 w-64 max-w-full" />
                  <div className="flex flex-wrap items-center gap-3">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-32 rounded-md" />
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
