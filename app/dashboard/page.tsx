"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Flag, Loader2, PieChart, Plus, RefreshCw, Users } from "lucide-react"
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

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/dashboard/details", {
        method: "POST",
      })
      const data = await res.json()
      if (res.ok) {
        setDashboardData(data.dashboard)
      } else {
        console.error("Error fetching dashboard details", data)
      }
    } catch (error) {
      console.error("Error fetching dashboard details", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text py-2 text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-md">Manage your gigs and track your activity</p>
          </div>

          <Button onClick={fetchData} variant="outline" className="flex items-center gap-2 border-slate-300">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-700">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <PieChart className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-3xl font-bold text-slate-800">{dashboardData?.totalProjects || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-700">Total Pings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-slate-800">{dashboardData?.totalPings || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-700">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow hover:shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Create New Gig
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Your Projects</h2>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {dashboardData?.projects && dashboardData.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
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
                    .map((project) => (
                      <ProjectCard key={project._id} project={project} />
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
                    .map((project) => (
                      <ProjectCard key={project._id} project={project} />
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

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
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
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-slate-800 line-clamp-1">{project.title}</CardTitle>
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
        <CardDescription className="line-clamp-2 text-slate-600 mt-1">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skillsRequired.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              {skill}
            </Badge>
          ))}
          {project.skillsRequired.length > 3 && (
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              +{project.skillsRequired.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Expires {formatDate(project.expiresAt)}</span>
          </div>
          {project.isFlagged && (
            <div className="flex items-center gap-2 text-red-600">
              <Flag className="h-4 w-4" />
              <span>Flagged ({project.reportCount} reports)</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={() => router.push(`/open-gig/${project._id}`)}
          variant="outline"
          className="w-full border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ message = "No projects found" }: { message?: string }) {
  const router = useRouter();
  return (
    <Card className="border-dashed border-slate-300 bg-slate-50/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <PieChart className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-700 mb-2">{message}</h3>
        <p className="text-slate-500 text-center max-w-md mb-6">
          Create your first gig to start receiving applications from talented professionals.
        </p>
        <Button onClick={() => router.push("/add-gigs")} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Gig
        </Button>
      </CardContent>
    </Card>
  )
}

export default Dashboard
