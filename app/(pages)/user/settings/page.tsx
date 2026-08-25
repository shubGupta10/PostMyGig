"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Activity, Mail, LinkIcon, LogOut, Trash2, AlertTriangle, Award, ShieldCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUserStore, useUserData, useUserLoading } from "@/modules/users/store/userDataStore"
import { useAuthStore } from "@/modules/users/store/useAuthStore"
import SettingsLoading from "./loading"

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

  const [requestingVerification, setRequestVerification] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);

  const handleClearCache = async () => {
    setIsClearingCache(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const res = await fetch("/api/user/clear-cache", { method: "POST" })
      if (!res.ok) throw new Error("Failed to clear system cache")
      setSuccessMessage("System cache and rate limits cleared successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsClearingCache(false)
    }
  }

  const handleRequestVerification = async () => {
    setRequestVerification(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/user/request-verification", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to request verification");
      }

      if (user?.id) {
        await fetchUserData(user.id);
      }
      setSuccessMessage("Verification request submitted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setRequestVerification(false)
    }
  }

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
    return <SettingsLoading />
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
          <div className="bg-primary/10 text-primary text-sm font-medium px-4 py-3 rounded-xl border border-primary/20">
            {successMessage}
          </div>
        )}

        {/* Premium Account Verification Section */}
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
            Account Verification
          </p>

          <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 premium-gradient p-6 shadow-sm transition-all hover:border-primary/40">
            {/* Decorative background element */}
            <div className="absolute -right-8 -top-8 opacity-5 pointer-events-none">
              <Award className="w-48 h-48 text-primary" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5 w-full">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Award className="w-7 h-7 text-primary" />
                </div>

                <div className="space-y-1 w-full max-w-lg">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-foreground">Verified Badge</h3>
                    {userData?.verificationStatus === 'approved' && (
                      <span className="bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-green-500/20">
                        Verified
                      </span>
                    )}
                    {userData?.verificationStatus === 'pending' && (
                      <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-yellow-500/20">
                        Under Review
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {userData?.verificationStatus === 'approved'
                      ? "Your account has been verified. The verified badge is now displayed on your profile."
                      : userData?.verificationStatus === 'pending'
                        ? "Our team is currently reviewing your account. This usually takes 24-48 hours."
                        : "Stand out to clients by earning a verified badge. Complete 3 gigs to unlock the ability to request a review."}
                  </p>

                  {/* Progress Bar for Eligible/Not Eligible */}
                  {userData?.verificationStatus !== 'approved' && userData?.verificationStatus !== 'pending' && (
                    <div className="mt-5 pt-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-foreground">Eligibility Progress</span>
                        <span className="text-xs font-bold text-primary">
                          {Math.min(userData?.completedGigCount || 0, 3)} / 3 Gigs
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(((userData?.completedGigCount || 0) / 3) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {userData?.verificationStatus !== 'approved' && userData?.verificationStatus !== 'pending' && (
                <div className="shrink-0 mt-4 md:mt-0">
                  <Button
                    onClick={handleRequestVerification}
                    disabled={requestingVerification || (userData?.completedGigCount || 0) < 3}
                    className={`h-12 px-6 rounded-xl font-semibold shadow-sm transition-all w-full md:w-auto ${(userData?.completedGigCount || 0) >= 3
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground border-2 border-border/50"
                      }`}
                  >
                    {requestingVerification ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Requesting...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4 mr-2" /> Request Verification</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>


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
            {/* Clear Cache */}
            {user?.isAdmin && (
              <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-border/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Clear System Cache</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">Clear all cached data including rate limits and dashboard data.</p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isClearingCache} className="border-border text-orange-500 hover:bg-orange-500 hover:text-white font-semibold h-10 rounded-xl shrink-0">
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
            )}

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
