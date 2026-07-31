import { Suspense } from "react"
import { ApplicationsList } from "@/components/applications/ApplicationsList"
import { Skeleton } from "@/components/ui/skeleton"

function Loading() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-border">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 sm:p-6 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 sm:p-8 border-t border-border flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 gap-6 px-6 py-4 bg-muted border-b border-border">
          <Skeleton className="col-span-5 h-4 w-24" />
          <Skeleton className="col-span-2 h-4 w-16" />
          <Skeleton className="col-span-2 h-4 w-16" />
          <Skeleton className="col-span-3 h-4 w-24 ml-auto" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 sm:p-6 border-b border-border last:border-b-0 hidden lg:grid grid-cols-12 gap-6 items-center">
            <div className="col-span-5 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="col-span-3 flex gap-2 justify-end">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ViewApplicationsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<Loading />}>
          <ApplicationsList />
        </Suspense>
      </div>
    </div>
  )
}