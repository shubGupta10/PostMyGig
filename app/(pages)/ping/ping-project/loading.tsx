import { Skeleton } from "@/components/ui/skeleton"

export default function PingLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 sm:w-80" />
          <Skeleton className="h-5 w-full max-w-md" />
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-2xl border-2 border-border shadow-xs p-6 sm:p-8 space-y-6">
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Skeleton className="h-11 w-24 rounded-xl" />
            <Skeleton className="h-11 w-48 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  )
}
