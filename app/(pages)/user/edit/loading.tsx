import { Skeleton } from "@/components/ui/skeleton"

export default function EditProfileLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 sm:w-80" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>

        {/* Form Fields Skeleton */}
        <div className="w-full space-y-8 pb-24">
          
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="sm:col-span-2 space-y-2.5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>

          {/* Skills */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-28" />
            <div className="p-4 rounded-2xl border-2 border-border bg-card space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Portfolio Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-9 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
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
