import { Skeleton } from "@/components/ui/skeleton"

export default function ChatHistoryLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-7 w-32 mb-6" />
        
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card rounded-2xl border-2 border-border shadow-sm p-6 flex flex-col sm:flex-row sm:items-start gap-5">
              <Skeleton className="size-14 rounded-xl shrink-0" />
              
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-6 w-24 rounded-md shrink-0" />
                </div>
                
                <Skeleton className="h-5 w-64 mb-2" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-2">
                  <div className="space-y-2 flex-1 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-9 w-32 rounded-lg shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
