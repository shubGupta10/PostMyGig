"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AdminOverviewCards } from "@/modules/admin/components/AdminOverviewCards"
import { AdminUsersTab } from "@/modules/admin/components/AdminUsersTab"
import { AdminProjectsTab } from "@/modules/admin/components/AdminProjectsTab"
import { AdminFeedbackTab } from "@/modules/admin/components/AdminFeedbackTab"
import { AdminVerificationTab } from "@/modules/admin/components/AdminVerificationTab"
import { PlatformSeeder } from "@/modules/admin/components/PlatformSeeder"
import AdminAnalyticsTab from "@/modules/admin/components/AdminAnalyticsTab"
import { AdminApplicationsTab } from "@/modules/admin/components/AdminApplicationsTab"
import AdminDashboardLoading from "./loading"

import { AdminApplicationFeed, DashboardData, VerificationRequest } from "@/modules/admin/components/types"

export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <AdminDashboardContent />
    </Suspense>
  )
}

function AdminDashboardContent() {
  const { data: session, status } = useSession()
  const user = session?.user

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeTab = searchParams.get("tab") || "analytics"

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [userPage, setUserPage] = useState(1)
  const [projectPage, setProjectPage] = useState(1)
  const [feedbackPage, setFeedbackPage] = useState(1)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(null)
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [applicationPage, setApplicationPage] = useState(1)
  const [isClearingCache, setIsClearingCache] = useState(false)

  const handleClearCache = async () => {
    setIsClearingCache(true)
    try {
      const res = await fetch("/api/user/clear-cache", { method: "POST" })
      if (!res.ok) throw new Error("Failed to clear system cache")
      toast.success("System cache and rate limits cleared successfully!")
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsClearingCache(false)
    }
  }

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
        body: JSON.stringify({
          userEmail: user?.email,
          userPage,
          projectPage,
          feedbackPage,
          applicationPage
        }),
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

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch("/api/admin/fetch-admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email }),
      })
      const data = await res.json()
      setAnalyticsData(data.chartData)
    } catch (error) {
      console.error("Failed to fetch analytics data", error)
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
    }
  }, [user?.email, userPage, projectPage, feedbackPage, applicationPage])

  useEffect(() => {
    if (user?.email) {
      fetchAnalyticsData()
      fetchVerificationReqs()
    }
  }, [user?.email])

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
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isClearingCache} className="border-border text-orange-500 hover:bg-orange-500 hover:text-white font-semibold h-10 rounded-xl">
                {isClearingCache ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {isClearingCache ? "Clearing..." : "Clear Cache"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <RefreshCw className="size-5 text-orange-500" /> Clear System Cache?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will flush all cached data including active rate limits, dashboard caches, and public feed data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isClearingCache}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCache} disabled={isClearingCache} className="bg-orange-500 text-white hover:bg-orange-600">
                  {isClearingCache ? "Clearing..." : "Clear"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {(status === "loading" || loading) && !dashboardData ? (
          <AdminDashboardLoading />
        ) : (
          <>
            <AdminOverviewCards
              totalUsers={dashboardData?.counts?.totalUsers || 0}
              totalProjects={dashboardData?.counts?.totalProjects || 0}
              totalPingSends={dashboardData?.counts?.totalPingSends || 0}
              totalFeedback={totalFeedbackCount}
            />

            {/* Tab Navigation & Subsections */}
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => router.replace(`${pathname}?tab=${value}`, { scroll: false })}
              className="space-y-6"
            >
              <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar w-full h-auto p-1.5 gap-1 bg-muted/80 rounded-xl">
                <TabsTrigger value="analytics" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="users" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Users
                </TabsTrigger>
                <TabsTrigger value="projects" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="applications" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Applications
                </TabsTrigger>
                <TabsTrigger value="feedback" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Feedback ({totalFeedbackCount})
                </TabsTrigger>
                <TabsTrigger value="verification" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Verification
                </TabsTrigger>
                <TabsTrigger value="seeder" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Platform Seeder
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="space-y-6">
                <AdminAnalyticsTab chartData={analyticsData} />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <AdminUsersTab
                  users={dashboardData?.allData?.totalUsersData || []}
                  pagination={dashboardData?.pagination?.userPagination}
                  onPageChange={(page) => setUserPage(page)}
                  onToggleVerify={handleToggleVerify}
                />
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <AdminProjectsTab
                  projects={dashboardData?.allData?.totalProjectsData || []}
                  pagination={dashboardData?.pagination?.projectPagination}
                  onPageChange={(page) => setProjectPage(page)}
                  onDeleteProject={deleteGig}
                  deletingProjectId={deletingProjectId}
                />
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <AdminApplicationsTab 
                  applications={dashboardData?.allData?.applicationPageData || []}
                  pagination={dashboardData?.pagination?.applicationPagination}
                  onPageChange={(page) => setApplicationPage(page)}
                />
              </TabsContent>

              <TabsContent value="feedback" className="space-y-6">
                <AdminFeedbackTab
                  feedbacks={dashboardData?.allData?.fetchALLFeedbacks || []}
                  pagination={dashboardData?.pagination?.feedbackPagination}
                  onPageChange={(page) => setFeedbackPage(page)}
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
          </>
        )}
      </div>
    </div>
  )
}
