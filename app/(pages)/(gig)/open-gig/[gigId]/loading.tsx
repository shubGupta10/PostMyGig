import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Skeleton using card pattern */}
        <div className="bg-transparent mb-6 sm:mb-8">
          <div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex gap-4 mb-6">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
                <Skeleton className="h-10 sm:h-12 w-3/4 rounded-2xl mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>
              <div className="lg:w-auto w-full flex flex-col gap-4">
                <Skeleton className="h-11 w-full lg:w-48 rounded-xl" />
                <Skeleton className="h-11 w-full lg:w-48 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-border">
                <Skeleton className="h-6 w-32 rounded-lg mb-4" />
                <Skeleton className="h-[150px] w-full rounded-xl" />
              </div>
              <div className="p-4 sm:p-6 lg:p-8 border-b border-border">
                <Skeleton className="h-6 w-48 rounded-lg mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-6 w-40 rounded-lg mb-6" />
                <Skeleton className="h-[100px] w-full rounded-xl" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl border-2 border-border" />
          </div>
        </div>
        
      </div>
    </div>
  )
}
