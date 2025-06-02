"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  FolderOpen,
  Send,
  Search,
  MoreHorizontal,
  Shield,
  MapPin,
  Calendar,
  Mail,
  ExternalLink,
  Trash2,
  Loader2,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  Clock,
  Filter,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserType {
  _id: string
  name: string
  email: string
  role: string
  profilePhoto: string
  bio: string
  location: string
  skills: string[]
  contactLinks: Array<{ label: string; url: string; _id: string }>
  isBanned: boolean
  reportCount: number
  createdAt: string
  updatedAt: string
  provider: string
}

interface Project {
  _id: string
  title: string
  description: string
  createdBy: string
  budget: string
  AcceptedFreelancerEmail: string
  skillsRequired: string[]
  status: string
  expiresAt: string
  reportCount: number
  isFlagged: boolean
  createdAt: string
  updatedAt: string
}

interface Feedback {
  _id: string
  name: string
  email: string
  feedback: string
  feedbackType: string
  submittedAt: string
  createdAt: string
  updatedAt: string
}

interface DashboardData {
  counts: {
    totalUsers: number
    totalProjects: number
    totalPingSends: number
  }
  allData: {
    totalUsersData: UserType[]
    totalProjectsData: Project[]
    fetchALLFeedbacks: Feedback[]
  }
}

function AdminDashboard() {
  const { data: session, status } = useSession()
  const user = session?.user
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState("")
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState("all")
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(null)

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

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      setDeletingFeedbackId(feedbackId)
      const response = await fetch("/api/user/admin/delete-feedback", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user?.email,
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
    if (status === "authenticated" && user?.email) {
      fetchData()
    }
  }, [status, user?.email])

  const filteredUsers =
    dashboardData?.allData?.totalUsersData?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const filteredFeedbacks =
    dashboardData?.allData?.fetchALLFeedbacks?.filter((feedback) => {
      const matchesSearch =
        feedback.name.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
        feedback.feedback.toLowerCase().includes(feedbackSearchTerm.toLowerCase())

      const matchesType = feedbackTypeFilter === "all" || feedback.feedbackType === feedbackTypeFilter

      return matchesSearch && matchesType
    }) || []

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "freelancer":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getFeedbackTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "suggestion":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
      case "general":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
      case "complaint":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      case "bug":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getFeedbackTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />
      case "general":
        return <MessageCircle className="h-4 w-4" />
      case "complaint":
        return <AlertTriangle className="h-4 w-4" />
      case "bug":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return formatDate(dateString)
  }

  const getFeedbackStats = () => {
    const feedbacks = dashboardData?.allData?.fetchALLFeedbacks || []
    const stats = {
      total: feedbacks.length,
      suggestion: feedbacks.filter((f) => f.feedbackType === "suggestion").length,
      general: feedbacks.filter((f) => f.feedbackType === "general").length,
      complaint: feedbacks.filter((f) => f.feedbackType === "complaint").length,
      bug: feedbacks.filter((f) => f.feedbackType === "bug").length,
    }
    return stats
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Please log in to access the admin dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const feedbackStats = getFeedbackStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{dashboardData?.counts?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users in the system</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">{dashboardData?.counts?.totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active projects in the platform</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ping Sends</CardTitle>
              <Send className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">{dashboardData?.counts?.totalPingSends || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Total ping notifications sent</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{feedbackStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">User feedback submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="feedback">Feedback ({feedbackStats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage and monitor all registered users</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profilePhoto || "/placeholder.svg"} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.location || "Not specified"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.skills?.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {user.skills?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(user.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.isBanned ? "bg-destructive/10 text-destructive" : "bg-chart-1/10 text-chart-1"
                              }
                            >
                              {user.isBanned ? "Banned" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Send Message</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  {user.isBanned ? "Unban User" : "Ban User"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects Overview</CardTitle>
                <CardDescription>Monitor and manage all projects in the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData?.allData?.totalProjectsData?.map((project) => (
                    <Card key={project._id} className="border border-border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg truncate pr-2">{project.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  disabled={deletingProjectId === project._id}
                                >
                                  {deletingProjectId === project._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteGig(project._id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge
                              className={
                                project.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {project.status}
                            </Badge>
                            <span className="text-sm font-medium text-primary">{project.budget}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.skillsRequired?.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {project.skillsRequired?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.skillsRequired.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No projects data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* Feedback Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Feedback Management
                    </CardTitle>
                    <CardDescription>Monitor and respond to user feedback submissions</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Select value={feedbackTypeFilter} onValueChange={setFeedbackTypeFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="suggestion">Suggestions</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="complaint">Complaints</SelectItem>
                        <SelectItem value="bug">Bug Reports</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search feedback..."
                        value={feedbackSearchTerm}
                        onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                        className="pl-8 w-full sm:w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFeedbacks && filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((feedback) => (
                      <Card
                        key={feedback._id}
                        className="border border-border hover:shadow-lg transition-all duration-200 hover:border-primary/20"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-10 w-10 border-2 border-muted">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {feedback.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-foreground">{feedback.name}</h4>
                                  <Badge className={getFeedbackTypeColor(feedback.feedbackType)}>
                                    {getFeedbackTypeIcon(feedback.feedbackType)}
                                    <span className="ml-1 capitalize">{feedback.feedbackType}</span>
                                  </Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {feedback.email}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {getTimeAgo(feedback.submittedAt)}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDateTime(feedback.submittedAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  disabled={deletingFeedbackId === feedback._id}
                                >
                                  {deletingFeedbackId === feedback._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this feedback from {feedback.name}? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteFeedback(feedback._id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-l-primary/30">
                              <p className="text-sm leading-relaxed text-foreground">{feedback.feedback}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">ID: {feedback._id.slice(-8)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No feedback found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        {feedbackTypeFilter !== "all" || feedbackSearchTerm
                          ? "Try adjusting your filters or search terms to find feedback."
                          : "No feedback has been submitted yet. When users submit feedback, it will appear here."}
                      </p>
                      {(feedbackTypeFilter !== "all" || feedbackSearchTerm) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setFeedbackTypeFilter("all")
                            setFeedbackSearchTerm("")
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
