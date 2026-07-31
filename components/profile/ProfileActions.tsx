"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Edit, LogOut, Activity, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
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

export function ProfileActions({ userData }: { userData: UserData }) {
  const session = useSession()
  const router = useRouter()
  const { handleLogout } = useAuthStore()
  const { setUserData: StoreUserDataIntoStore } = useUserStore()

  const [toggleActivity, setToggleActivity] = useState(userData.activityPublic ?? false)
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false)
  const [activityUpdateStatus, setActivityUpdateStatus] = useState<"success" | "error" | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    StoreUserDataIntoStore(userData)
  }, [userData, StoreUserDataIntoStore])

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
      } else {
        setActivityUpdateStatus("error")
        setToggleActivity(!newValue)
      }
    } catch {
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
    } catch {
      setDeleteError("Network error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Activity Toggle */}
      <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
        <div className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Visibility</p>
          <div className="bg-muted rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center border border-border">
                  <Activity className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Public Activity</p>
                  <p className="text-xs text-muted-foreground">Make your activity visible to others</p>
                </div>
              </div>
              <Switch checked={toggleActivity} onCheckedChange={toggleSwitchActivity} disabled={isUpdatingActivity} />
            </div>
            {activityUpdateStatus === "success" && <p className="text-xs text-primary font-medium mt-3">Visibility updated</p>}
            {activityUpdateStatus === "error" && <p className="text-xs text-destructive font-medium mt-3">Failed to update</p>}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
        <div className="p-6 space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Actions</p>

          <Button onClick={() => router.push(`/user/edit/?userId=${userData._id}`)} className="w-full bg-primary text-primary-foreground font-semibold h-11">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isDeleting} className="w-full border-border text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold h-11">
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" /> Delete Account Permanently?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError && <div className="text-destructive text-sm bg-muted p-3 rounded-lg border border-border">{deleteError}</div>}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteUserAccount} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" onClick={handleLogout} className="w-full border-border text-foreground hover:bg-muted font-semibold h-11">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

    </div>
  )
}
