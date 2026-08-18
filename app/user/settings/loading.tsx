import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Account Verification Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-36 ml-2" />
          <div className="rounded-2xl border-2 border-primary/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5 w-full">
              <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="space-y-3 w-full max-w-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-2">
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            </div>
            <Skeleton className="h-12 w-44 rounded-xl shrink-0" />
          </div>
        </div>

        {/* Privacy Preferences Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-40 ml-2" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3.5 w-60 sm:w-80" />
                  </div>
                </div>
                <Skeleton className="h-6 w-11 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone Skeleton */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-28 ml-2" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3.5 w-56 sm:w-72" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
