import { Skeleton } from "@/components/ui/skeleton"

export default function ChatLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex w-full overflow-hidden">
      {/* Left Column: Chat Thread List Skeleton */}
      <div className="w-80 lg:w-96 border-r border-border bg-card flex flex-col shrink-0 hidden md:flex">
        {/* Header */}
        <div className="h-16 px-4 border-b border-border flex items-center gap-2 shrink-0">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border shrink-0">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Section Label */}
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <Skeleton className="h-3.5 w-36" />
        </div>

        {/* Chat Thread Skeletons */}
        <div className="flex-1 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3 border-b border-border">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Chat Workspace Main Screen */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {/* Chat Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-border flex items-center justify-between gap-4 shrink-0 bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="space-y-1.5 min-w-0">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-hidden flex flex-col justify-end">
          <div className="flex items-end gap-2.5 max-w-md">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <Skeleton className="h-16 w-64 rounded-2xl rounded-bl-sm" />
          </div>

          <div className="flex items-end justify-end gap-2.5">
            <Skeleton className="h-12 w-56 rounded-2xl rounded-br-sm bg-primary/20" />
          </div>

          <div className="flex items-end gap-2.5 max-w-md">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <Skeleton className="h-20 w-80 rounded-2xl rounded-bl-sm" />
          </div>

          <div className="flex items-end justify-end gap-2.5">
            <Skeleton className="h-14 w-60 rounded-2xl rounded-br-sm bg-primary/20" />
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 flex-1 rounded-2xl" />
            <Skeleton className="size-11 rounded-2xl shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
