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

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  // Initialize form with session data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user])

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
        setSuccessMessage("Profile updated successfully!")
        setTimeout(() => {
          router.push("/user/profile")
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

  if (!user) {
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
            <h3 className="text-2xl font-bold text-foreground mb-3">Loading Editor</h3>
            <p className="text-muted-foreground text-lg">Please wait while we prepare your profile editor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 px-4 py-2 rounded-lg hover:bg-accent font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>

          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Edit3 className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground">Edit Profile</h1>
                <p className="text-muted-foreground text-lg mt-2">Update your personal information and preferences</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>All changes are saved automatically</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-border focus:border-primary focus:ring-primary bg-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-border focus:border-primary focus:ring-primary bg-input"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label htmlFor="location" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country (e.g., Mumbai, India)"
                    className="h-12 border-border focus:border-primary focus:ring-primary bg-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent-foreground" />
                </div>
                About You
              </h2>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-semibold text-card-foreground">
                  Professional Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell us about yourself, your experience, skills, and what makes you unique. This will be visible on your profile..."
                  className="resize-none border-border focus:border-primary focus:ring-primary bg-input"
                />
                <p className="text-sm text-muted-foreground">
                  {formData.bio.length}/500 characters • A good bio helps others understand your expertise
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent-foreground" />
                </div>
                Skills & Expertise
              </h2>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill (e.g., React, Node.js, Design)"
                      className="h-12 border-border focus:border-primary focus:ring-primary bg-input"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </Button>
                </div>

                {formData.skills.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-card-foreground">Your Skills ({formData.skills.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="group bg-secondary border border-secondary-foreground/20 rounded-xl p-3 flex items-center justify-between hover:bg-secondary/80 transition-colors duration-200"
                        >
                          <span className="text-secondary-foreground font-medium text-sm truncate">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 p-1 text-secondary-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">No skills added yet</p>
                    <p className="text-muted-foreground text-sm mt-2">Add your skills to showcase your expertise</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Links Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  Contact Links
                </h2>
                <Button
                  type="button"
                  onClick={addContactLink}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-4">
                {formData.contactLinks.map((link, index) => (
                  <div
                    key={index}
                    className="bg-muted border border-border rounded-xl p-4 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Label</label>
                          <Input
                            type="text"
                            placeholder="e.g., LinkedIn, Portfolio, GitHub"
                            value={link.label}
                            onChange={(e) => updateContactLink(index, "label", e.target.value)}
                            className="h-10 border-border focus:border-primary focus:ring-primary bg-input"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">URL</label>
                          <Input
                            type="url"
                            placeholder="https://example.com/profile"
                            value={link.url}
                            onChange={(e) => updateContactLink(index, "url", e.target.value)}
                            className="h-10 border-border focus:border-primary focus:ring-primary bg-input"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeContactLink(index)}
                        className="mt-6 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 p-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {formData.contactLinks.length === 0 && (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">No contact links added yet</p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Add links to your portfolio, social media, or professional profiles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-destructive font-medium">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-primary font-medium">{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="px-8 py-3 border-border text-card-foreground hover:bg-muted hover:border-border rounded-xl font-semibold"
              >
                Cancel Changes
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPage