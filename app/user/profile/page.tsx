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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
}

function Profile() {
  const session = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
          color: "bg-red-50 text-red-700 border-red-200",
          icon: Shield,
          bgGradient: "from-red-50 to-rose-50",
        }
      case "freelancer":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: User,
          bgGradient: "from-blue-50 to-cyan-50",
        }
      case "client":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: UserCheck,
          bgGradient: "from-green-50 to-emerald-50",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: User,
          bgGradient: "from-gray-50 to-slate-50",
        }
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (session.status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div
                className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-green-500 animate-spin mx-auto"
                style={{ animationDelay: "0.3s", animationDuration: "1.5s" }}
              ></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Profile</h3>
            <p className="text-gray-600 text-lg">Please wait while we fetch your information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">{error}</p>
            <Button
              onClick={fetchUserData}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200">
          {/* Cover Background */}
          <div className={`h-32 sm:h-40 bg-gradient-to-r ${roleConfig.bgGradient} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
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
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white p-2 shadow-xl border-4 border-white">
                  {userData?.profilePhoto ? (
                    <img
                      src={userData?.profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <User className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-3 right-3 bg-blue-600 rounded-full p-2.5 text-white hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {userData?.name || "Not available"}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{userData?.email}</span>
                    </div>
                    {userData?.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{userData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {formatDate(userData?.createdAt || "")}
                  </Badge>

                  {userData?.isBanned && (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 font-medium animate-pulse"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Account Banned
                    </Badge>
                  )}

                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                    <Activity className="w-3 h-3 mr-1" />
                    {userData?.provider || "Unknown"} Account
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                <Button
                  onClick={() => router.push(`/user/edit/?userId=${userData?._id}`)}
                  className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 hover:border-red-300 hover:text-white px-6 py-3 rounded-xl font-semibold"
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  About Me
                </h2>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {userData?.bio || "No bio available. Add a bio to tell others about yourself and your expertise."}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  Skills & Expertise
                </h2>
                {userData?.skills && userData.skills.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {userData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center hover:bg-blue-100 transition-colors duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <span className="text-blue-700 font-semibold text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No skills listed yet</p>
                    <p className="text-gray-500 text-sm mt-2">Add your skills to showcase your expertise</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-green-600" />
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
                        className="group bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                            <ExternalLink className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-semibold truncate">{link.label}</p>
                            <p className="text-gray-500 text-sm truncate">{link.url}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No contact links available</p>
                    <p className="text-gray-500 text-sm mt-2">Add links to your portfolio, social media, or website</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  Account Stats
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Account Status</p>
                          <p className="text-lg font-bold text-blue-900">{userData?.isBanned ? "Banned" : "Active"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-medium">Reports</p>
                          <p className="text-lg font-bold text-green-900">{userData?.reportCount ?? 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-green-600" />
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Provider</label>
                    <p className="text-gray-900 font-medium mt-1 capitalize">{userData?.provider || "Not available"}</p>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Member Since</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <p className="text-gray-900 font-medium">{formatDate(userData?.createdAt || "")}</p>
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Last Updated</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-green-500" />
                      <p className="text-gray-900 font-medium">{formatDate(userData?.updatedAt || "")}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">User ID</label>
                    <p className="text-gray-900 font-mono text-sm mt-1 bg-gray-50 rounded-lg px-3 py-2 border">
                      {userData?._id || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push(`/user/edit/?userId=${userData?._id}`)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-green-600 border-blue-200 text-white hover:bg-green-600 hover:border-green-300 hover:text-white py-3 rounded-xl font-semibold"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-red-200 text-white bg-red-600 hover:bg-red-700 hover:border-red-300 hover:text-white py-3 rounded-xl font-semibold"
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
