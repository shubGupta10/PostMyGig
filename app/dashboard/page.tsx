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
      <div className="w-full min-h-[50vh] flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-md">Manage your gigs and track your activity</p>
          </div>

          <Button 
            onClick={fetchData} 
            variant="outline" 
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-800">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{dashboardData?.totalProjects || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-800">Total Pings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{dashboardData?.totalPings || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-700 text-white shadow hover:shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Create New Gig
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <TabsList className="bg-gray-100 border border-gray-200">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:border-green-200 text-gray-600">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:border-green-200 text-gray-600">
                  Active
                </TabsTrigger>
                <TabsTrigger value="expired" className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:border-green-200 text-gray-600">
                  Expired
                </TabsTrigger>
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
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
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
    <Card className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg text-gray-900 line-clamp-1 flex-1">{project.title}</CardTitle>
          <Badge className={`${getStatusColor(project.status)} border`}>{project.status}</Badge>
        </div>
        <CardDescription className="line-clamp-2 text-gray-600 mt-2">{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skillsRequired.slice(0, 3).map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              {skill}
            </Badge>
          ))}
          {project.skillsRequired.length > 3 && (
            <Badge 
              variant="outline" 
              className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              +{project.skillsRequired.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Expires {formatDate(project.expiresAt)}</span>
          </div>
          {project.isFlagged && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-1 rounded">
              <Flag className="h-4 w-4" />
              <span className="text-sm">Flagged ({project.reportCount} reports)</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button
          onClick={() => router.push(`/open-gig/${project._id}`)}
          variant="outline"
          className="w-full border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
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
    <Card className="border-dashed border-gray-300 bg-gray-50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 bg-white rounded-full mb-6 shadow-sm">
          <PieChart className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
        <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
          Create your first gig to start receiving applications from talented professionals.
        </p>
        <Button 
          onClick={() => router.push("/add-gigs")} 
          className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-700 text-white px-6 py-2"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Gig
        </Button>
      </CardContent>
    </Card>
  )
}

export default Dashboard