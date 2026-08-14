"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  User,
  Mail,
  MapPin,
  Plus,
  X,
  Save,
  ArrowLeft,
  ExternalLink,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Edit3,
  Globe,
  Star,
  LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUserStore, useUserData, useUserLoading, useUserError } from "@/store/userDataStore"

interface ContactLinks {
  label: string
  url: string
}

function EditPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data } = useSession()
  const user = data?.user
  const userId = searchParams.get("userId")
  
  // Zustand store hooks
  const userData = useUserData()
  const userLoading = useUserLoading()
  const userError = useUserError()
  const { fetchUserData, updateUserData } = useUserStore()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    contactLinks: [] as ContactLinks[],
    skills: [] as string[],
  })

  const [newSkill, setNewSkill] = useState("")

  // Fetch user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (userId && !userData && !userLoading) {
        try {
          await fetchUserData(userId)
        } catch (error) {
          console.error("Error fetching user data:", error)
          setError("Failed to load user data")
        }
      }
    }

    loadUserData()
  }, [userId, userData, userLoading, fetchUserData])

  // Populate form with userData when available
  useEffect(() => {
    if (userData && !dataLoaded) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        location: userData.location || "",
        contactLinks: userData.contactLinks || [],
        skills: userData.skills || [],
      })
      setDataLoaded(true)
    }
  }, [userData, dataLoaded])

  // Fallback to session data if userData is not available
  useEffect(() => {
    if (user && !userData && !dataLoaded) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user, userData, dataLoaded])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle contact links
  const addContactLink = () => {
    setFormData((prev) => ({
      ...prev,
      contactLinks: [...prev.contactLinks, { label: "", url: "" }],
    }))
  }

  const updateContactLink = (index: number, field: "label" | "url", value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactLinks: prev.contactLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }))
  }

  const removeContactLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contactLinks: prev.contactLinks.filter((_, i) => i !== index),
    }))
  }

  // Handle skills
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch("/api/user/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      })

      const data = await res.json()

      if (res.status === 200) {
        if (userData) {
          updateUserData({
            ...formData,
            updatedAt: new Date().toISOString(),
          })
        }
        
        setSuccessMessage("Profile updated successfully!")
        setTimeout(() => {
          router.push(`/user/profile/${user?.id}`)
        }, 1500)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Network error occurred")
    } finally {
      setSaving(false)
    }
  }

  // Show loading state while fetching user data
  if (userLoading || (!userData && !user)) {
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
            <h3 className="text-2xl font-bold text-foreground mb-3">Loading Profile Data</h3>
            <p className="text-muted-foreground text-lg">Please wait while we load your profile information...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if user data failed to load
  if (userError && !userData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto text-center p-6">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Failed to Load Profile</h3>
            <p className="text-muted-foreground text-lg mb-6">{userError}</p>
            <Button onClick={() => router.back()} className="mr-4">
              Go Back
            </Button>
            <Button 
              variant="outline" 
              onClick={() => userId && fetchUserData(userId)}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 max-w-3xl pt-2">
          {/* Basic Information */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Basic Information
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm sm:text-base font-semibold text-foreground">
                  Full Name *
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm sm:text-base font-semibold text-foreground">
                  Email Address *
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-2 space-y-2">
                <label htmlFor="location" className="text-sm sm:text-base font-semibold text-foreground">
                  Location
                </label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country (e.g., Mumbai, India)"
                  className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              About You
            </p>
            
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm sm:text-base font-semibold text-foreground">
                Professional Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={6}
                placeholder="Tell us about yourself, your experience, skills, and what makes you unique..."
                className="text-sm bg-background border-2 border-border focus:border-primary resize-none placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.bio.length}/500 characters • A good bio helps others understand your expertise
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Skills & Expertise
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (e.g., React, Node.js, Design)"
                    className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addSkill}
                  disabled={!newSkill.trim()}
                  className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm flex items-center gap-2">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive transition-colors duration-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Links Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0">
                Contact Links
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={addContactLink}
                className="border-border text-foreground hover:bg-muted text-sm h-9 rounded-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {formData.contactLinks.map((link, index) => (
                 <div key={index} className="flex flex-col sm:flex-row gap-3 items-start">
                   <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <Input
                        type="text"
                        placeholder="e.g., LinkedIn"
                        value={link.label}
                        onChange={(e) => updateContactLink(index, "label", e.target.value)}
                        className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                      />
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateContactLink(index, "url", e.target.value)}
                        className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                      />
                   </div>
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => removeContactLink(index)}
                     className="h-11 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 px-3 w-full sm:w-auto"
                   >
                     <X className="w-4 h-4" />
                   </Button>
                 </div>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-destructive font-medium text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-primary/10 border border-transparent rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-primary font-medium text-sm">{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-12 px-8 border-border text-foreground hover:bg-muted font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPage