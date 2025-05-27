"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Clock,
  Flag,
  Plus,
  RefreshCw,
  Users,
  TrendingUp,
  Briefcase,
  Star,
  Eye,
  BarChart3,
  Activity,
  ShieldAlert,
  AlertCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface Project {
  _id: string
  title: string
  description: string
  skillsRequired: string[]
  status: string
  createdAt: string
  expiresAt: string
  createdBy: string
  isFlagged: boolean
  reportCount: number
}

interface DashboardProps {
  projects: Project[]
  totalPings: number
  totalProjects: number
}

interface RateLimitInfo {
  isLimited: boolean
  retryAfter: string | null
  message: string
  timestamp: number
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    isLimited: false,
    retryAfter: null,
    message: "",
    timestamp: 0,
  })

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    setRateLimitInfo((prev) => ({ ...prev, isLimited: false, message: "" }))

    try {
      const res = await fetch("/api/dashboard/details", {
        method: "POST",
      })

      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After") || "60"
        const rateLimitMessage = `Rate limit exceeded. Too many requests. Please wait ${retryAfter} seconds before trying again.`

        setRateLimitInfo({
          isLimited: true,
          retryAfter,
          message: rateLimitMessage,
          timestamp: Date.now(),
        })

        setError(rateLimitMessage)
        return
      }

      const data = await res.json()
      if (res.ok) {
        setDashboardData(data.dashboard)
      } else {
        console.error("Error fetching dashboard details", data)
        setError("Failed to load dashboard. Please try again later.")
      }
    } catch (error) {
      console.error("Error fetching dashboard details", error)
      setError("Failed to load dashboard. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryClick = () => {
    if (rateLimitInfo.isLimited) {
      // Update the rate limit message to show user tried too early
      setRateLimitInfo((prev) => ({
        ...prev,
        message: `Please wait! You're still rate limited. Try again in ${prev.retryAfter || "a few"} seconds.`,
      }))
      return
    }
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Rate Limit Banner Component
  const RateLimitBanner = () => {
    if (!rateLimitInfo.isLimited) return null

    return (
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-800 mb-1">Rate Limit Exceeded</h4>
            <p className="text-amber-700 text-sm leading-relaxed">{rateLimitInfo.message}</p>
            <div className="mt-2 text-xs text-amber-600">
              <strong>Tip:</strong> To avoid rate limits, try refreshing less frequently.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Rate Limit Banner */}
          <RateLimitBanner />

          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Rate Limit Banner */}
          <RateLimitBanner />

          <div className="flex flex-col items-center justify-center py-20">
            <div
              className={`w-20 h-20 ${rateLimitInfo.isLimited ? "bg-gradient-to-br from-amber-50 to-orange-100" : "bg-gradient-to-br from-red-50 to-rose-100"} rounded-2xl flex items-center justify-center mb-8 shadow-lg`}
            >
              {rateLimitInfo.isLimited ? (
                <ShieldAlert className="w-10 h-10 text-amber-500" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900">
                {rateLimitInfo.isLimited ? "Rate Limit Exceeded" : "Oops! Something went wrong"}
              </h3>
              <p className="text-gray-600 leading-relaxed">{error}</p>

              {/* Rate Limit Details */}
              {rateLimitInfo.isLimited && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700 font-medium">Status:</span>
                      <span className="text-amber-800">Rate Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700 font-medium">Retry After:</span>
                      <span className="text-amber-800">{rateLimitInfo.retryAfter || "Unknown"} seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700 font-medium">Time:</span>
                      <span className="text-amber-800">{new Date(rateLimitInfo.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleRetryClick}
              disabled={rateLimitInfo.isLimited}
              className={`mt-8 inline-flex items-center gap-3 px-8 py-4 ${
                rateLimitInfo.isLimited
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105"
              } text-white rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold`}
            >
              <RefreshCw className={`w-5 h-5 ${rateLimitInfo.isLimited ? "" : ""}`} />
              {rateLimitInfo.isLimited ? "Please Wait..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const activeProjects = dashboardData?.projects?.filter((p) => p.status.toLowerCase() === "active").length || 0
  const expiredProjects = dashboardData?.projects?.filter((p) => p.status.toLowerCase() === "expired").length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rate Limit Banner */}
        <RateLimitBanner />

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full border border-blue-200">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Dashboard Overview</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Welcome Back! 👋</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Track your gigs, monitor performance, and manage your projects all in one place
            </p>
          </div>

          <Button
            onClick={handleRetryClick}
            disabled={rateLimitInfo.isLimited}
            variant="outline"
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              rateLimitInfo.isLimited
                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                : "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            {rateLimitInfo.isLimited ? "Rate Limited" : "Refresh Data"}
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-blue-800">Total Projects</CardTitle>
                <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-blue-900">{dashboardData?.totalProjects || 0}</span>
                <p className="text-sm text-blue-700">All time projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-green-800">Total Pings</CardTitle>
                <div className="p-3 bg-green-500 rounded-full shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-green-900">{dashboardData?.totalPings || 0}</span>
                <p className="text-sm text-green-700">Interest received</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-800">Active Gigs</CardTitle>
                <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-purple-900">{activeProjects}</span>
                <p className="text-sm text-purple-700">Currently active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-orange-800">Success Rate</CardTitle>
                <div className="p-3 bg-orange-500 rounded-full shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-orange-900">
                  {dashboardData?.totalProjects ? Math.round((activeProjects / dashboardData.totalProjects) * 100) : 0}%
                </span>
                <p className="text-sm text-orange-700">Project success</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
                <p className="text-gray-600">Manage and track all your gigs</p>
              </div>
              <TabsList className="bg-white border border-gray-200 shadow-sm">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-500 data-[state=active]:text-white text-gray-600 font-medium"
                >
                  All ({dashboardData?.totalProjects || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-500 data-[state=active]:text-white text-gray-600 font-medium"
                >
                  Active ({activeProjects})
                </TabsTrigger>
                <TabsTrigger
                  value="expired"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-500 data-[state=active]:text-white text-gray-600 font-medium"
                >
                  Expired ({expiredProjects})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {dashboardData?.projects && dashboardData.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.projects.map((project, index) => (
                    <ProjectCard key={project._id} project={project} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              {dashboardData?.projects &&
              dashboardData.projects.filter((p) => p.status.toLowerCase() === "active").length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.projects
                    .filter((project) => project.status.toLowerCase() === "active")
                    .map((project, index) => (
                      <ProjectCard key={project._id} project={project} index={index} />
                    ))}
                </div>
              ) : (
                <EmptyState message="No active projects found" />
              )}
            </TabsContent>

            <TabsContent value="expired" className="mt-0">
              {dashboardData?.projects &&
              dashboardData.projects.filter((p) => p.status.toLowerCase() === "expired").length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.projects
                    .filter((project) => project.status.toLowerCase() === "expired")
                    .map((project, index) => (
                      <ProjectCard key={project._id} project={project} index={index} />
                    ))}
                </div>
              ) : (
                <EmptyState message="No expired projects found" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter()

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
      case "expired":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
      case "pending":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200"
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200"
    }
  }

  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <Card
      className="border-gray-200 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-300 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg text-gray-900 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors duration-200">
            {project.title}
          </CardTitle>
          <Badge className={`${getStatusColor(project.status)} border font-medium`}>{project.status}</Badge>
        </div>
        <CardDescription className="line-clamp-3 text-gray-600 leading-relaxed">{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {project.skillsRequired.slice(0, 3).map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-green-100 transition-all duration-200"
            >
              {skill}
            </Badge>
          ))}
          {project.skillsRequired.length > 3 && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              +{project.skillsRequired.length - 3} more
            </Badge>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Expires {formatDate(project.expiresAt)}</span>
            </div>
          </div>
          {project.isFlagged && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <Flag className="h-4 w-4" />
              <span className="text-sm font-medium">Flagged ({project.reportCount} reports)</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100">
        <Button
          onClick={() => router.push(`/open-gig/${project._id}`)}
          className="w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ message = "No projects found" }: { message?: string }) {
  const router = useRouter()

  return (
    <Card className="border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
      <CardContent className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Briefcase className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{message}</h3>
        <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
          Create your first gig to start receiving applications from talented professionals and grow your network.
        </p>
        <Button
          onClick={() => router.push("/add-gigs")}
          className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Gig
        </Button>
      </CardContent>
    </Card>
  )
}

export default Dashboard