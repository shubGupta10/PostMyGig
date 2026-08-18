"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Modular Admin Subcomponents
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminOverviewCards } from "@/components/admin/AdminOverviewCards"
import { AdminUsersTab } from "@/components/admin/AdminUsersTab"
import { AdminProjectsTab } from "@/components/admin/AdminProjectsTab"
import { AdminFeedbackTab } from "@/components/admin/AdminFeedbackTab"
import { AdminVerificationTab } from "@/components/admin/AdminVerificationTab"
import { PlatformSeeder } from "@/components/admin/PlatformSeeder"
import AdminDashboardLoading from "./loading"

import { DashboardData, VerificationRequest } from "@/components/admin/types"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const user = session?.user

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(null)
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])

  const fetchVerificationReqs = async () => {
    try {
      const res = await fetch("/api/user/admin/fetch-verification-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email }),
      })
      const data = await res.json()
      setVerificationRequests(data.users || [])
    } catch (error) {
      console.error("Failed to fetch verification requests", error)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/user/admin/fetch-admin-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: user?.email }),
      })
      const data = await res.json()
      setDashboardData(data.data)
    } catch (error) {
      console.error("Failed to fetch data", error)
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const deleteGig = async (gigId: string) => {
    try {
      setDeletingProjectId(gigId)
      const response = await fetch("/api/user/admin/delete-gig", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
          gigId: gigId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Project deleted successfully")
        await fetchData()
      } else {
        throw new Error(result.message || "Failed to delete project")
      }
    } catch (error) {
      console.error("Failed to delete project", error)
      toast.error("Failed to delete project")
    } finally {
      setDeletingProjectId(null)
    }
  }

  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/user/admin/verify-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: user?.email,
          targetUserId: userId,
          isVerified: !currentStatus,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || "Verification status updated")
        await fetchData()
      } else {
        throw new Error(result.message || "Failed to update verification status")
      }
    } catch (error) {
      console.error("Failed to update verification status", error)
      toast.error("Failed to update verification status")
    }
  }

  const handleResolveVerification = async (userId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/user/admin/resolve-verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email, targetUserId: userId, action }),
      })
      if (res.ok) {
        toast.success(`User verification ${action}d`)
        fetchVerificationReqs()
        fetchData()
      } else {
        toast.error("Failed to resolve verification")
      }
    } catch (error) {
      console.error("Error resolving verification", error)
      toast.error("Error resolving verification")
    }
  }

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      setDeletingFeedbackId(feedbackId)
      const response = await fetch("/api/user/admin/delete-feedback", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: user?.email,
          feedbackId: feedbackId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Feedback deleted successfully")
        await fetchData()
      } else {
        throw new Error(result.message || "Failed to delete feedback")
      }
    } catch (error) {
      console.error("Failed to delete feedback", error)
      toast.error("Failed to delete feedback")
    } finally {
      setDeletingFeedbackId(null)
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchData()
      fetchVerificationReqs()
    }
  }, [user?.email])

  if (status === "loading" || loading) {
    return <AdminDashboardLoading />
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-sm">
              Please log in with admin privileges to access the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalFeedbackCount = dashboardData?.allData?.fetchALLFeedbacks?.length || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <AdminHeader userName={user?.name} userImage={user?.image} />

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Metric Cards */}
        <AdminOverviewCards
          totalUsers={dashboardData?.counts?.totalUsers || 0}
          totalProjects={dashboardData?.counts?.totalProjects || 0}
          totalPingSends={dashboardData?.counts?.totalPingSends || 0}
          totalFeedback={totalFeedbackCount}
        />

        {/* Tab Navigation & Subsections */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="flex overflow-x-auto no-scrollbar w-full sm:grid sm:grid-cols-5 h-auto p-1.5 gap-1 bg-muted/80 rounded-xl">
            <TabsTrigger value="users" className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
              Users
            </TabsTrigger>
            <TabsTrigger value="projects" className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
              Projects
            </TabsTrigger>
            <TabsTrigger value="feedback" className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
              Feedback ({totalFeedbackCount})
            </TabsTrigger>
            <TabsTrigger value="verification" className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
              Verification
            </TabsTrigger>
            <TabsTrigger value="seeder" className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
              Platform Seeder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <AdminUsersTab
              users={dashboardData?.allData?.totalUsersData || []}
              onToggleVerify={handleToggleVerify}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <AdminProjectsTab
              projects={dashboardData?.allData?.totalProjectsData || []}
              onDeleteProject={deleteGig}
              deletingProjectId={deletingProjectId}
            />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <AdminFeedbackTab
              feedbacks={dashboardData?.allData?.fetchALLFeedbacks || []}
              onDeleteFeedback={handleDeleteFeedback}
              deletingFeedbackId={deletingFeedbackId}
            />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <AdminVerificationTab
              requests={verificationRequests}
              onResolve={handleResolveVerification}
            />
          </TabsContent>

          <TabsContent value="seeder" className="space-y-6">
            <PlatformSeeder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
