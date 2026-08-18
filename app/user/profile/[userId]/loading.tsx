import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-card rounded-2xl border-2 border-border shadow-xs overflow-hidden">
          <div className="h-32 sm:h-44 bg-muted/50 relative" />
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 relative z-10">
            <Skeleton className="size-32 sm:size-36 rounded-2xl border-4 border-card shrink-0" />
            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Portfolio Projects */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-44 w-full rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>

            {/* Verification / Stats */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
