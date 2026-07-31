import { fetchDashboardDetails } from "./services/dashboardApi"
import { RateLimitBanner } from "@/components/dashboard/RateLimitBanner"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { DashboardProjects } from "@/components/dashboard/DashboardProjects"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
  const cookieStore = cookies()
  const cookieString = cookieStore.toString()
  
  const result = await fetchDashboardDetails(cookieString)

  if (result.error) {
    throw new Error(result.error)
  }

  const dashboardData = result.data
  const activeProjects = dashboardData?.projects?.filter((p: any) => p.status.toLowerCase() === "active").length || 0
  const expiredProjects = dashboardData?.projects?.filter((p: any) => p.status.toLowerCase() === "expired").length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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