"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Shield,
  AlertTriangle,
  ExternalLink,
  Edit,
  LogOut,
  Camera,
  Star,
  Award,
  Clock,
  Activity,
  LinkIcon,
  UserCheck,
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface ContactLinks {
  label: string
  url: string
}

interface UserData {
  _id: string
  name: string
  email: string
  bio: string
  contactLinks: ContactLinks[]
  createdAt: string
  updatedAt: string
  isBanned: boolean
  location: string
  profilePhoto: string
  provider: string
  reportCount: number
  role: "freelancer" | "client" | "admin"
  skills: string[]
  activityPublic?: boolean // Added this field
}

function Profile() {
  const session = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toggleActivity, setToggleActivity] = useState(false)
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false)
  const [activityUpdateStatus, setActivityUpdateStatus] = useState<'success' | 'error' | null>(null)
  const router = useRouter()

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (res.status === 200) {
        setUserData(data.user)
        // Only set toggle state if activityPublic exists in the response
        if (data.user.activityPublic !== undefined) {
          setToggleActivity(data.user.activityPublic)
        }
        // If activityPublic doesn't exist, keep the default false state
        console.log("User data fetched successfully:", data)
      } else {
        setError(data.message || "Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session.data?.user?.id) {
      fetchUserData()
    }
  }, [session.data?.user?.id])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "admin":
        return {
          color: "bg-destructive/10 text-destructive border-destructive/20",
          icon: Shield,
          bgGradient: "from-destructive/5 to-destructive/10",
        }
      case "freelancer":
        return {
          color: "bg-destructive/10 text-destructive border-destructive/20",
          icon: User,
          bgGradient: "from-primary/5 to-primary/10",
        }
      case "client":
        return {
          color: "bg-accent/50 text-accent-foreground border-accent/30",
          icon: UserCheck,
          bgGradient: "from-accent/20 to-accent/30",
        }
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          icon: User,
          bgGradient: "from-muted to-muted/80",
        }
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const toggleSwitchActivity = async (newValue: boolean) => {
    setIsUpdatingActivity(true)
    setActivityUpdateStatus(null)

    try {
      const response = await fetch("/api/user/toggleActivityPublic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ activityPublic: newValue })
      })

      const data = await response.json()

      if (response.ok) {
        setToggleActivity(newValue)
        setActivityUpdateStatus('success')
        if (userData) {
          setUserData({
            ...userData,
            activityPublic: newValue
          })
        }
        console.log("Activity visibility updated successfully:", data)
      } else {
        setActivityUpdateStatus('error')
        console.error("Failed to update activity visibility:", data.message || "Unknown error")
        setToggleActivity(!newValue)
      }
    } catch (error) {
      setActivityUpdateStatus('error')
      console.error("Error updating activity visibility:", error)
      // Revert the toggle state on error
      setToggleActivity(!newValue)
    } finally {
      setIsUpdatingActivity(false)
      // Clear status after 3 seconds
      setTimeout(() => {
        setActivityUpdateStatus(null)
      }, 3000)
    }
  }

  if (session.status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-muted border-t-primary mx-auto"></div>
              <div
                className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-accent animate-spin mx-auto"
                style={{ animationDelay: "0.3s", animationDuration: "1.5s" }}
              ></div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Loading Profile</h3>
            <p className="text-muted-foreground text-lg">Please wait while we fetch your information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{error}</p>
            <Button
              onClick={fetchUserData}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Loader2 className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const roleConfig = getRoleConfig(userData?.role || "user")
  const RoleIcon = roleConfig.icon

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header Card */}
        <div className="bg-card rounded-3xl shadow-xl overflow-hidden mb-8 border border-border">
          {/* Cover Background */}
          <div className={`h-32 sm:h-40 bg-gradient-to-r ${roleConfig.bgGradient} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 "></div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className={`${roleConfig.color} border font-semibold`}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {userData?.role || "User"}
              </Badge>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-card p-2 shadow-xl border-4 border-card">
                  {userData?.profilePhoto ? (
                    <img
                      src={userData?.profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                      <User className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-3 right-3 bg-primary rounded-full p-2.5 text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {userData?.name || "Not available"}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{userData?.email}</span>
                    </div>
                    {userData?.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{userData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Badge variant="outline" className="bg-auto text-accent-foreground border-transparent font-medium">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {formatDate(userData?.createdAt || "")}
                  </Badge>

                  {userData?.isBanned && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 font-medium animate-pulse"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Account Banned
                    </Badge>
                  )}

                  <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent/30 font-medium">
                    <Activity className="w-3 h-3 mr-1" />
                    {userData?.provider || "Unknown"} Account
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                <Button
                  onClick={() => router.push(`/user/edit/?userId=${userData?._id}`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-destructive-foreground bg-destructive hover:bg-destructive/90 hover:border-destructive/30 hover:text-destructive-foreground px-6 py-3 rounded-xl font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  About Me
                </h2>
                <div className="bg-muted rounded-xl p-6 border border-border">
                  <p className="text-foreground leading-relaxed text-lg">
                    {userData?.bio || "No bio available. Add a bio to tell others about yourself and your expertise."}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/50 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-accent-foreground" />
                  </div>
                  Skills & Expertise
                </h2>
                {userData?.skills && userData.skills.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {userData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center hover:bg-primary/20 transition-colors duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <span className="text-primary font-semibold text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground text-lg font-medium">No skills listed yet</p>
                    <p className="text-muted-foreground text-sm mt-2">Add your skills to showcase your expertise</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/50 rounded-xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  Contact Links
                </h2>
                {userData?.contactLinks && userData.contactLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.contactLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-muted border border-border rounded-xl p-4 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                            <ExternalLink className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-semibold truncate">{link.label}</p>
                            <p className="text-muted-foreground text-sm truncate">{link.url}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground text-lg font-medium">No contact links available</p>
                    <p className="text-muted-foreground text-sm mt-2">Add links to your portfolio, social media, or website</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Statistics */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-primary" />
                  Account Stats
                </h3>
                <div className="space-y-4">
                  <div className="bg-auto rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground font-medium">Account Status</p>
                          <p className="text-lg font-bold text-primary">{userData?.isBanned ? "Banned" : "Active"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-auto rounded-xl p-4 border border-accent/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-accent-foreground font-medium">Reports</p>
                          <p className="text-lg font-bold text-accent-foreground">{userData?.reportCount ?? 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Toggle Section */}
                  <div className="bg-auto rounded-xl p-4 border border-accent/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-accent-foreground font-medium">Public Activity</p>
                              <p className="text-xs text-muted-foreground">
                                Make your activity visible to others
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Status indicators */}
                              {activityUpdateStatus === 'success' && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              {activityUpdateStatus === 'error' && (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              {isUpdatingActivity && (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                              )}
                              <Switch
                                checked={toggleActivity}
                                onCheckedChange={toggleSwitchActivity}
                                disabled={isUpdatingActivity}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Status message */}
                    {activityUpdateStatus === 'success' && (
                      <div className="mt-2 text-xs text-green-600 bg-green-50 rounded-md px-2 py-1">
                        Activity visibility updated successfully
                      </div>
                    )}
                    {activityUpdateStatus === 'error' && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-md px-2 py-1">
                        Failed to update activity visibility. Please try again.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-accent-foreground" />
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Provider</label>
                    <p className="text-foreground font-medium mt-1 capitalize">{userData?.provider || "Not available"}</p>
                  </div>

                  <div className="border-b border-border pb-4">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Member Since</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-foreground font-medium">{formatDate(userData?.createdAt || "")}</p>
                    </div>
                  </div>

                  <div className="border-b border-border pb-4">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Last Updated</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-accent-foreground" />
                      <p className="text-foreground font-medium">{formatDate(userData?.updatedAt || "")}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">User ID</label>
                    <p className="text-foreground font-mono text-sm mt-1 bg-muted rounded-lg px-3 py-2 border border-border">
                      {userData?._id || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push(`/user/edit/?userId=${userData?._id}`)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-accent hover:bg-accent/80 border-accent/30 text-accent-foreground hover:text-accent-foreground py-3 rounded-xl font-semibold"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-destructive/20 text-destructive-foreground bg-destructive hover:bg-destructive/90 hover:border-destructive/30 hover:text-destructive-foreground py-3 rounded-xl font-semibold"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile