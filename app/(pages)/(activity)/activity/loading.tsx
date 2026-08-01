import { Skeleton } from "@/components/ui/skeleton"

export default function ActivityLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <Skeleton className="size-9 sm:size-10 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
