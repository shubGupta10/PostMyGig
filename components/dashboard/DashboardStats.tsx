"use client"

import { Card } from "@/components/ui/card"
import { Briefcase, Users, TrendingUp, BarChart3 } from "lucide-react"

interface DashboardStatsProps {
  totalProjects: number
  totalPings: number
  activeProjects: number
}

export function DashboardStats({ totalProjects, totalPings, activeProjects }: DashboardStatsProps) {
  const successRate = totalProjects ? Math.round((activeProjects / totalProjects) * 100) : 0

  const stats = [
    {
      title: "Total Gigs",
      value: totalProjects,
      description: "All-time posted",
      icon: Briefcase,
      colorClass: "text-primary",
    },
    {
      title: "Total Pings",
      value: totalPings,
      description: "Engagement",
      icon: Users,
      colorClass: "text-secondary-foreground",
    },
    {
      title: "Active Gigs",
      value: activeProjects,
      description: "Currently open",
      icon: TrendingUp,
      colorClass: "text-primary",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      description: "Project completion",
      icon: BarChart3,
      colorClass: "text-secondary-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="p-3.5 sm:p-5 flex flex-col justify-between border border-border bg-card shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Icon className={`h-4 w-4 shrink-0 ${stat.colorClass}`} />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${stat.colorClass}`}>{stat.value}</span>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">{stat.description}</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
