import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="w-full bg-card rounded-2xl border-2 border-border shadow-xs p-8 sm:p-12 space-y-8">
        
        {/* Brand & Heading */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Skeleton className="size-16 rounded-2xl" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* 2 Role Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-6 rounded-2xl border-2 border-border bg-background space-y-4">
            <Skeleton className="size-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border-2 border-border bg-background space-y-4">
            <Skeleton className="size-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

      </div>
    </div>
  )
}
