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
  FolderGit2,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUserStore, useUserData, useUserLoading, useUserError } from "@/modules/users/store/userDataStore"
import { PortfolioProject } from "@/modules/users/models/UserModel"
import EditProfileLoading from "./loading"

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
    portfolioProjects: [] as PortfolioProject[],
    yearsOfExperience: "" as number | "",
    hourlyRate: "" as number | "",
  })

  const [newSkill, setNewSkill] = useState("")

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
        portfolioProjects: userData.portfolioProjects || [],
        yearsOfExperience: userData.yearsOfExperience ?? "",
        hourlyRate: userData.hourlyRate ?? "",
      })
      setDataLoaded(true)
    }
  }, [userData, dataLoaded])

  useEffect(() => {
    if (user && !userData && !dataLoaded) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user, userData, dataLoaded])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  // Handle Portfolio Projects
  const addProject = () => {
    if (formData.portfolioProjects.length >= 4) return;
    setFormData((prev) => ({
      ...prev,
      portfolioProjects: [
        ...prev.portfolioProjects,
        { title: "", description: "", tags: [], liveUrl: "", githubUrl: "" },
      ],
    }))
  }

  const updateProject = (index: number, field: keyof PortfolioProject, value: any) => {
    setFormData((prev) => ({
      ...prev,
      portfolioProjects: prev.portfolioProjects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      ),
    }))
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolioProjects: prev.portfolioProjects.filter((_, i) => i !== index),
    }))
  }

  const handleProjectTagsChange = (index: number, tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    updateProject(index, "tags", tags)
  }


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
          const payload = {
            ...formData,
            yearsOfExperience: formData.yearsOfExperience === "" ? undefined : Number(formData.yearsOfExperience),
            hourlyRate: formData.hourlyRate === "" ? undefined : Number(formData.hourlyRate),
            updatedAt: new Date().toISOString(),
          }
          updateUserData(payload)
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
    return <EditProfileLoading />
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
            Edit Your <span className="text-primary">Profile</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Keep your skills, bio, and featured projects updated to maximize your recommendation ranking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8 pb-24">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-3.5">
              <label htmlFor="name" className="block text-base font-semibold text-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground focus:border-primary rounded-2xl px-5"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-3.5">
              <label htmlFor="email" className="block text-base font-semibold text-foreground">
                Email Address <Lock className="w-3.5 h-3.5 inline-block ml-1 text-muted-foreground -mt-0.5" />
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={user?.email || formData.email || ""}
                disabled
                className="h-14 bg-background border-2 border-border text-base text-muted-foreground cursor-not-allowed rounded-2xl px-5 disabled:opacity-60"
                placeholder="Your email address"
              />
              <p className="text-xs text-muted-foreground">Email addresses cannot be changed.</p>
            </div>

            {/* Location */}
            <div className="sm:col-span-2 space-y-2.5">
              <label htmlFor="location" className="block text-base font-semibold text-foreground">
                Location
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country (e.g., Mumbai, India)"
                className="h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground focus:border-primary rounded-2xl px-5"
              />
            </div>
            
            {/* Experience & Rate */}
            <div className="space-y-2.5">
              <label htmlFor="yearsOfExperience" className="block text-base font-semibold text-foreground">
                Years of Experience
              </label>
              <Input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                min="0"
                max="60"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground focus:border-primary rounded-2xl px-5"
                placeholder="e.g., 5"
              />
            </div>

            <div className="space-y-2.5">
              <label htmlFor="hourlyRate" className="block text-base font-semibold text-foreground">
                Hourly Rate ($/hr)
              </label>
              <Input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                min="0"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground focus:border-primary rounded-2xl px-5"
                placeholder="e.g., 45"
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-3.5">
            <label htmlFor="bio" className="block text-base font-semibold text-foreground">
              Professional Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={6}
              placeholder="Tell us about yourself, your experience, skills, and what makes you unique..."
              className="w-full text-base bg-background border-2 border-border focus:border-primary resize-y placeholder:text-muted-foreground rounded-2xl p-5 leading-relaxed min-h-[160px]"
            />
            <p className="text-xs text-muted-foreground">
              {formData.bio.length}/500 characters • A detailed bio helps clients understand your expertise.
            </p>
          </div>

          {/* Skills Section */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-foreground">
              Skills & Expertise
            </label>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill (e.g., React, Node.js, Next.js)"
                  className="h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground focus:border-primary rounded-2xl px-5"
                />
              </div>
              <Button
                type="button"
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="h-14 px-6 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="w-5 h-5 mr-1" />
                Add Skill
              </Button>
            </div>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm flex items-center gap-2">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive transition-colors duration-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Portfolio Projects */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-foreground">
                  Featured Portfolio Projects ({formData.portfolioProjects.length}/4)
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Highlight your real-world proof of work. Our recommendation engine uses your project tech stacks to match you with top gigs!
                </p>
              </div>
              {formData.portfolioProjects.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProject}
                  className="border-2 border-border text-foreground hover:bg-muted text-sm h-11 px-4 rounded-xl font-semibold shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Project
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {formData.portfolioProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-card border-2 border-border rounded-2xl p-6 space-y-4 relative shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-primary" />
                      Project #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-foreground">Project Title *</label>
                      <Input
                        type="text"
                        placeholder="e.g., SaaSify Billing Engine"
                        value={project.title}
                        onChange={(e) => updateProject(index, "title", e.target.value)}
                        className="h-12 bg-background border-2 border-border text-sm rounded-xl px-4"
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Tech Stack (comma separated) *
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Next.js, Stripe, TailwindCSS, TypeScript"
                        value={project.tags.join(", ")}
                        onChange={(e) => handleProjectTagsChange(index, e.target.value)}
                        className="h-12 bg-background border-2 border-border text-sm rounded-xl px-4"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-xs font-semibold text-foreground">Short Description *</label>
                    <Textarea
                      placeholder="Briefly describe what you built, key features, and your role..."
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      rows={3}
                      className="w-full text-sm bg-background border-2 border-border focus:border-primary resize-y placeholder:text-muted-foreground rounded-xl p-4 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-foreground">Live Demo URL</label>
                      <Input
                        type="url"
                        placeholder="https://my-app.app"
                        value={project.liveUrl || ""}
                        onChange={(e) => updateProject(index, "liveUrl", e.target.value)}
                        className="h-12 bg-background border-2 border-border text-sm rounded-xl px-4"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-foreground">GitHub Repo URL</label>
                      <Input
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={project.githubUrl || ""}
                        onChange={(e) => updateProject(index, "githubUrl", e.target.value)}
                        className="h-12 bg-background border-2 border-border text-sm rounded-xl px-4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Links Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-foreground">
                Contact Links
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={addContactLink}
                className="border-2 border-border text-foreground hover:bg-muted text-sm h-10 px-4 rounded-xl font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {formData.contactLinks.map((link, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <Input
                      type="text"
                      placeholder="e.g., LinkedIn or Website"
                      value={link.label}
                      onChange={(e) => updateContactLink(index, "label", e.target.value)}
                      className="h-12 bg-background border-2 border-border text-sm placeholder:text-muted-foreground focus:border-primary rounded-xl px-4"
                    />
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateContactLink(index, "url", e.target.value)}
                      className="h-12 bg-background border-2 border-border text-sm placeholder:text-muted-foreground focus:border-primary rounded-xl px-4"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeContactLink(index)}
                    className="h-12 border-destructive/30 text-destructive hover:bg-destructive/10 px-4 rounded-xl cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-destructive font-medium text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-primary font-medium text-sm">{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 h-14 bg-transparent border-2 border-border text-foreground font-bold text-base rounded-2xl transition-opacity hover:opacity-90 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 h-14 bg-primary text-primary-foreground font-bold text-base rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
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