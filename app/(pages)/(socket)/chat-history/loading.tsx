import { Skeleton } from "@/components/ui/skeleton"

export default function ChatHistoryLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex w-full overflow-hidden">
      {/* Left Column: Thread List Skeleton */}
      <div className="w-80 lg:w-96 border-r border-border bg-card flex flex-col shrink-0 hidden md:flex">
        {/* Header */}
        <div className="h-16 px-4 border-b border-border flex items-center gap-2 shrink-0">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Search Bar */}
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

        {/* Second Section Label */}
        <div className="px-4 py-3 bg-muted/40 border-t border-border">
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>

      {/* Right Column: Chat Area Skeleton */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Header */}
        <div className="h-16 px-4 bg-card border-b border-border flex items-center gap-3 shrink-0">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 space-y-4">
          {/* Incoming message */}
          <div className="flex justify-start">
            <Skeleton className="h-12 w-48 rounded-2xl rounded-tl-sm" />
          </div>
          {/* Outgoing message */}
          <div className="flex justify-end">
            <Skeleton className="h-12 w-56 rounded-2xl rounded-tr-sm" />
          </div>
          {/* Incoming message */}
          <div className="flex justify-start">
            <Skeleton className="h-16 w-64 rounded-2xl rounded-tl-sm" />
          </div>
          {/* Outgoing message */}
          <div className="flex justify-end">
            <Skeleton className="h-12 w-40 rounded-2xl rounded-tr-sm" />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-card border-t border-border flex items-center gap-3 shrink-0">
          <Skeleton className="flex-1 h-10 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
