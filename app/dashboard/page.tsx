import { RateLimitBanner } from "@/components/dashboard/RateLimitBanner"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { DashboardProjects } from "@/components/dashboard/DashboardProjects"
import { getDashboardDetails } from "./services/dashboardService"


export default async function Dashboard() {
  const result = await getDashboardDetails();

  if (result.error) {
    throw new Error(result.error)
  }

  const dashboardData = result.data
  const activeProjects = dashboardData?.projects?.filter((p: any) => p.status.toLowerCase() === "active").length || 0
  const expiredProjects = dashboardData?.projects?.filter((p: any) => p.status.toLowerCase() === "expired").length || 0

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <RateLimitBanner rateLimitInfo={result.rateLimitInfo} />

        <DashboardStats
          totalProjects={dashboardData?.totalProjects || 0}
          totalPings={dashboardData?.totalPings || 0}
          activeProjects={activeProjects}
        />

        <DashboardProjects
          projects={dashboardData?.projects || []}
        />
      </div>
    </div>
  )
}