import { GigListSkeleton } from "@/components/gigs/GigListSkeleton"

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <GigListSkeleton />
      </div>
    </div>
  )
}
