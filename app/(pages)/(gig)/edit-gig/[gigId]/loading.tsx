import { Skeleton } from "@/components/ui/skeleton"

export default function EditGigLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 sm:w-80" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>

        {/* Form Skeleton */}
        <div className="w-full space-y-8 pb-24">
          
          {/* Title */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>

          {/* Deadline */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          {/* Budget */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Skeleton className="h-14 rounded-2xl sm:col-span-1" />
              <Skeleton className="h-14 rounded-2xl sm:col-span-3" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Skeleton className="h-12 w-28 rounded-xl" />
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>

        </div>

      </div>
    </div>
  )
}
