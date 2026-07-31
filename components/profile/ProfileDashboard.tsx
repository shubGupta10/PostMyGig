"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  User, Mail, MapPin, Calendar, Shield, AlertTriangle, ExternalLink,
  Edit, LogOut, Camera, Star, Award, Clock, Activity, LinkIcon,
  UserCheck, Settings, Loader2, Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUserStore } from "@/store/userDataStore"
import { useAuthStore } from "@/store/useAuthStore"
import type { UserData } from "@/app/user/profile/[userId]/types"

export function ProfileDashboard({ initialUserData }: { initialUserData: UserData }) {
  const session = useSession()
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [toggleActivity, setToggleActivity] = useState(initialUserData.activityPublic ?? false)
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false)
  const [activityUpdateStatus, setActivityUpdateStatus] = useState<"success" | "error" | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { handleLogout } = useAuthStore()
  const { setUserData: StoreUserDataIntoStore } = useUserStore()

  // Sync with store on mount
  useEffect(() => {
    StoreUserDataIntoStore(userData)
  }, [userData, StoreUserDataIntoStore])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
  }

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "admin": return { color: "bg-destructive text-destructive-foreground border-destructive", icon: Shield }
      case "freelancer": return { color: "bg-primary text-primary-foreground border-primary", icon: User }
      case "client": return { color: "bg-accent text-accent-foreground border-accent", icon: UserCheck }
      default: return { color: "bg-muted text-muted-foreground border-border", icon: User }
    }
  }

  const toggleSwitchActivity = async (newValue: boolean) => {
    setIsUpdatingActivity(true)
    setActivityUpdateStatus(null)

    try {
      const response = await fetch("/api/user/toggleActivityPublic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityPublic: newValue }),
      })

      if (response.ok) {
        setToggleActivity(newValue)
        setActivityUpdateStatus("success")
        setUserData(prev => ({ ...prev, activityPublic: newValue }))
      } else {
        setActivityUpdateStatus("error")
        setToggleActivity(!newValue)
      }
    } catch (error) {
      setActivityUpdateStatus("error")
      setToggleActivity(!newValue)
    } finally {
      setIsUpdatingActivity(false)
      setTimeout(() => setActivityUpdateStatus(null), 3000)
    }
  }

  const deleteUserAccount = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session.data?.user.email }),
      })

      if (response.ok) {
        handleLogout()
      } else {
        const data = await response.json()
        setDeleteError(data.message || "Failed to delete account.")
      }
    } catch (error) {
      setDeleteError("Network error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const roleConfig = getRoleConfig(userData.role || "user")
  const RoleIcon = roleConfig.icon

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Card */}
        <div className="bg-card rounded-3xl shadow-sm overflow-hidden mb-8 border-2 border-border">
          {/* Cover Background */}
          <div className="h-32 sm:h-40 bg-muted relative">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className={`${roleConfig.color} font-semibold`}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {userData.role || "User"}
              </Badge>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-card p-2 shadow-sm border-2 border-border">
                  {userData.profilePhoto ? (
                    <img src={userData.profilePhoto} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-3 right-3 bg-primary rounded-full p-2.5 text-primary-foreground hover:bg-primary/90 transition-all shadow-md">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {userData.name}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{userData.email}</span>
                    </div>
                    {userData.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{userData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Badge variant="outline" className="bg-muted text-foreground border-border font-medium">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {formatDate(userData.createdAt)}
                  </Badge>

                  {userData.isBanned && (
                    <Badge variant="outline" className="bg-destructive text-destructive-foreground border-destructive font-medium animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Account Banned
                    </Badge>
                  )}

                  <Badge variant="outline" className="bg-muted text-foreground border-border font-medium">
                    <Activity className="w-3 h-3 mr-1" />
                    {userData.provider || "Unknown"} Account
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                <Button onClick={() => router.push(`/user/edit/?userId=${userData._id}`)} className="bg-primary text-primary-foreground font-semibold">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleLogout} className="text-destructive border-border hover:bg-destructive hover:text-destructive-foreground font-semibold">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bio Section */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-border overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  About Me
                </h2>
                <div className="bg-muted rounded-xl p-6 border border-border">
                  <p className="text-foreground leading-relaxed text-lg">
                    {userData.bio || "No bio available. Add a bio to tell others about yourself and your expertise."}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-border overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border">
                    <Star className="w-5 h-5 text-foreground" />
                  </div>
                  Skills & Expertise
                </h2>
                {userData.skills && userData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {userData.skills.map((skill, index) => (
                      <span key={index} className="bg-muted border border-border rounded-xl px-4 py-2 text-foreground font-semibold text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground text-lg font-medium">No skills listed yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-border overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border">
                    <LinkIcon className="w-5 h-5 text-foreground" />
                  </div>
                  Contact Links
                </h2>
                {userData.contactLinks && userData.contactLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.contactLinks.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="group bg-muted border border-border rounded-xl p-4 hover:border-primary transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center border border-border group-hover:border-primary transition-colors">
                            <ExternalLink className="w-5 h-5 text-foreground group-hover:text-primary" />
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Account Stats */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-border overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-foreground" />
                  Account Stats
                </h3>
                <div className="space-y-4">
                  
                  <div className="bg-muted rounded-xl p-4 border border-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center border border-border">
                      <Shield className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Account Status</p>
                      <p className="text-lg font-bold text-foreground">{userData.isBanned ? "Banned" : "Active"}</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-xl p-4 border border-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center border border-border">
                      <AlertTriangle className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Reports</p>
                      <p className="text-lg font-bold text-foreground">{userData.reportCount ?? 0}</p>
                    </div>
                  </div>

                  {/* Activity Toggle Section */}
                  <div className="bg-muted rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center border border-border">
                          <Activity className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground font-medium">Public Activity</p>
                          <p className="text-xs text-muted-foreground">Make your activity visible</p>
                        </div>
                      </div>
                      <Switch checked={toggleActivity} onCheckedChange={toggleSwitchActivity} disabled={isUpdatingActivity} />
                    </div>
                    {activityUpdateStatus === "success" && <div className="mt-3 text-xs text-primary font-medium">Activity visibility updated</div>}
                    {activityUpdateStatus === "error" && <div className="mt-3 text-xs text-destructive font-medium">Failed to update visibility</div>}
                  </div>

                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-border overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-foreground" />
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Provider</label>
                    <p className="text-foreground font-medium mt-1 capitalize">{userData.provider || "Not available"}</p>
                  </div>
                  <div className="border-b border-border pb-4">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Member Since</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-foreground" />
                      <p className="text-foreground font-medium">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">User ID</label>
                    <p className="text-foreground font-mono text-sm mt-1 bg-muted rounded-lg px-3 py-2 border border-border truncate">
                      {userData._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-border overflow-hidden">
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
                <Button onClick={() => router.push(`/user/edit/?userId=${userData._id}`)} className="w-full bg-primary text-primary-foreground font-semibold">
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
                
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={isDeleting} className="w-full border-border text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold">
                      {isDeleting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Trash2 className="w-5 h-5 mr-2" />}
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="size-5" /> Delete Account Permanently?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {deleteError && <div className="text-destructive text-sm bg-muted p-2 rounded">{deleteError}</div>}
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteUserAccount} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" onClick={handleLogout} className="w-full border-border text-foreground hover:bg-muted font-semibold">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
