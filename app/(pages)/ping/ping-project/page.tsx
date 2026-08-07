import { Suspense } from "react"
import { PingForm } from "@/components/ping/PingForm"
import { Skeleton } from "@/components/ui/skeleton"

function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-border">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[140px] w-full rounded-xl" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-[100px] w-full rounded-xl" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 sm:px-8 pb-6 sm:pb-8 border-t border-border pt-6">
          <Skeleton className="h-11 w-24 rounded-xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function PingProjectPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<Loading />}>
          <PingForm />
        </Suspense>
      </div>
    </div>
  )
}