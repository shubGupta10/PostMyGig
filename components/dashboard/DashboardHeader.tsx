"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  handleRetryClick: () => void
  isLimited: boolean
}

export function DashboardHeader({ handleRetryClick, isLimited }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground opacity-80 mt-1 font-normal">
          Overview of your projects and performance metrics
        </p>
      </div>

      <Button
        onClick={handleRetryClick}
        disabled={isLimited}
        className={`h-10 px-5 text-sm font-semibold transition-all rounded-xl shadow-sm ${
          isLimited
            ? "border border-border text-foreground opacity-60 cursor-not-allowed bg-muted"
            : "bg-secondary text-secondary-foreground hover:opacity-90"
        }`}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        {isLimited ? "Rate Limited" : "Refresh"}
      </Button>
    </div>
  )
}
