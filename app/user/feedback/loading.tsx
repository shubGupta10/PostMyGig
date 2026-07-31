import { Skeleton } from "@/components/ui/skeleton"

export default function FeedbackLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-8 border-b border-border">
            <Skeleton className="h-4 w-32 mb-5" />
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 border-b border-border">
            <Skeleton className="h-4 w-32 mb-5" />
            <div className="flex flex-wrap gap-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 border-b border-border">
            <Skeleton className="h-4 w-32 mb-5" />
            <Skeleton className="h-[200px] w-full rounded-md" />
          </div>

          <div className="p-6 sm:p-8">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

        </div>
      </div>
    </div>
  )
}
