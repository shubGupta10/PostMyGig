"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Activity, Mail, LinkIcon, LogOut, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUserStore, useUserData, useUserLoading } from "@/store/userDataStore"
import { useAuthStore } from "@/store/useAuthStore"

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user

  const userData = useUserData()
  const userLoading = useUserLoading()
  const { fetchUserData } = useUserStore()
  const { handleLogout } = useAuthStore()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Form state
  const [settings, setSettings] = useState({
    activityPublic: true,
    showEmail: false,
    showContactLinks: true,
  })

  // Initial state for isDirty check
  const [initialSettings, setInitialSettings] = useState({
    activityPublic: true,
    showEmail: false,
    showContactLinks: true,
  })

  // Computed property to check if settings have changed
  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings)

  // Fetch user data
  useEffect(() => {
    if (user?.id && !userData && !userLoading) {
      fetchUserData(user.id).catch(console.error)
    }
  }, [user?.id, userData, userLoading, fetchUserData])

  // Populate form
  useEffect(() => {
    if (userData && !dataLoaded) {
      const initial = {
        activityPublic: userData.activityPublic ?? true,
        showEmail: userData.showEmail ?? false,
        showContactLinks: userData.showContactLinks ?? true,
      }
      setSettings(initial)
      setInitialSettings(initial)
      setDataLoaded(true)
    }
  }, [userData, dataLoaded])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch("/api/user/update-privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        throw new Error("Failed to update settings")
      }

      // Re-fetch user data to update store
      if (user?.id) {
        await fetchUserData(user.id)
      }
      
      setInitialSettings(settings)

      setSuccessMessage("Privacy settings updated successfully")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error(err)
      setError("An error occurred while saving settings")
    } finally {
      setSaving(false)
    }
  }

  const deleteUserAccount = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email }),
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

  if (status === "loading" || (userLoading && !dataLoaded)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Actions Row */}
        {isDirty && (
          <div className="flex justify-end mb-4">
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground font-semibold h-11 px-6 rounded-xl shadow-xs w-full sm:w-auto transition-all">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/10 text-green-600 text-sm font-medium px-4 py-3 rounded-xl border border-green-500/20">
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
            Privacy Preferences
          </p>

          <div className="space-y-3">
            {/* Activity Toggle */}
            <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-row items-center justify-between gap-4 transition-all hover:border-border/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Public Activity</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">Make your open and completed gigs visible to others.</p>
                </div>
              </div>
              <Switch 
                checked={settings.activityPublic} 
                onCheckedChange={(v) => setSettings({ ...settings, activityPublic: v })} 
              />
            </div>

            {/* Email Toggle */}
            <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-row items-center justify-between gap-4 transition-all hover:border-border/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Display Email Address</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">Show your email address on your public profile.</p>
                </div>
              </div>
              <Switch 
                checked={settings.showEmail} 
                onCheckedChange={(v) => setSettings({ ...settings, showEmail: v })} 
              />
            </div>

            {/* Contact Links Toggle */}
            <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-row items-center justify-between gap-4 transition-all hover:border-border/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Show Contact Links</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">Display your portfolio and social media links.</p>
                </div>
              </div>
              <Switch 
                checked={settings.showContactLinks} 
                onCheckedChange={(v) => setSettings({ ...settings, showContactLinks: v })} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <p className="text-xs font-bold text-destructive uppercase tracking-widest px-2">
            Danger Zone
          </p>

          <div className="space-y-3">
            {/* Delete Account */}
            <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-border/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Delete Account Permanently</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">This action cannot be undone and deletes all your data.</p>
                </div>
              </div>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isDeleting} className="border-border text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold h-10 rounded-xl shrink-0">
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
            </div>

            {/* Logout */}
            <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-border/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0 text-secondary-foreground">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Sign Out</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">Log out of your PostMyGig account on this device.</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-border text-foreground hover:bg-muted font-semibold h-10 rounded-xl shrink-0">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
