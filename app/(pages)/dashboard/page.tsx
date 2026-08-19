import { getDashboardDetails } from "./services/dashboardService";
import { RateLimitBanner } from "@/components/dashboard/RateLimitBanner";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { FreelancerDashboard } from "@/components/dashboard/FreelancerDashboard";
import type { ClientDashboardData, FreelancerDashboardData } from "./types";

export default async function Dashboard() {
  const result = await getDashboardDetails();

  if (result.error || !result.data) {
    throw new Error(result.error || "Failed to load dashboard");
  }

  const dashboardData = result.data;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <RateLimitBanner rateLimitInfo={result.rateLimitInfo} />

        {dashboardData.role === "client" ? (
          <ClientDashboard data={dashboardData as ClientDashboardData} />
        ) : (
          <FreelancerDashboard data={dashboardData as FreelancerDashboardData} />
        )}
      </div>
    </div>
  );
}
