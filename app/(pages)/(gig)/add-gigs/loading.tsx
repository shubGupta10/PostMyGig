import { Skeleton } from "@/components/ui/skeleton"

export default function AddGigsLoading() {
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
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>

          {/* Skills */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          {/* Contact Details Card */}
          <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Budget & Expiry Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>

        </div>

      </div>
    </div>
  )
}
