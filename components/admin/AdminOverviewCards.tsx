import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Send, MessageSquare } from "lucide-react"

interface AdminOverviewCardsProps {
  totalUsers: number
  totalProjects: number
  totalPingSends: number
  totalFeedback: number
}

export function AdminOverviewCards({
  totalUsers,
  totalProjects,
  totalPingSends,
  totalFeedback,
}: AdminOverviewCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {/* Total Users */}
      <Card className="border-l-4 border-l-primary shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          <Users className="h-4 w-4 text-primary shrink-0" />
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold text-primary">{totalUsers}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">Registered in system</p>
        </CardContent>
      </Card>

      {/* Total Projects */}
      <Card className="border-l-4 border-l-chart-1 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-chart-1 shrink-0" />
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold text-chart-1">{totalProjects}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">Active in platform</p>
        </CardContent>
      </Card>

      {/* Total Ping Sends */}
      <Card className="border-l-4 border-l-chart-2 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Ping Sends</CardTitle>
          <Send className="h-4 w-4 text-chart-2 shrink-0" />
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold text-primary">{totalPingSends}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">Application pitches</p>
        </CardContent>
      </Card>

      {/* Total Feedback */}
      <Card className="border-l-4 border-l-chart-3 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-chart-3 shrink-0" />
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold text-primary">{totalFeedback}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">User submissions</p>
        </CardContent>
      </Card>
    </div>
  )
}
