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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Editor</h3>
            <p className="text-gray-600 text-lg">Please wait while we prepare your profile editor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600 text-lg mt-2">Update your personal information and preferences</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>All changes are saved automatically</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-500" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Location
                  </label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country (e.g., Mumbai, India)"
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                About You
              </h2>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                  Professional Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell us about yourself, your experience, skills, and what makes you unique. This will be visible on your profile..."
                  className="resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500">
                  {formData.bio.length}/500 characters • A good bio helps others understand your expertise
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

              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill (e.g., React, Node.js, Design)"
                      className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </Button>
                </div>

                {formData.skills.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Your Skills ({formData.skills.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="group bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center justify-between hover:bg-purple-100 transition-colors duration-200"
                        >
                          <span className="text-purple-700 font-medium text-sm truncate">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 p-1 text-purple-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No skills added yet</p>
                    <p className="text-gray-500 text-sm mt-2">Add your skills to showcase your expertise</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Links Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-green-600" />
                  </div>
                  Contact Links
                </h2>
                <Button
                  type="button"
                  onClick={addContactLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-4">
                {formData.contactLinks.map((link, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Label</label>
                          <Input
                            type="text"
                            placeholder="e.g., LinkedIn, Portfolio, GitHub"
                            value={link.label}
                            onChange={(e) => updateContactLink(index, "label", e.target.value)}
                            className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">URL</label>
                          <Input
                            type="url"
                            placeholder="https://example.com/profile"
                            value={link.url}
                            onChange={(e) => updateContactLink(index, "url", e.target.value)}
                            className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeContactLink(index)}
                        className="mt-6 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 p-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {formData.contactLinks.length === 0 && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No contact links added yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Add links to your portfolio, social media, or professional profiles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold"
              >
                Cancel Changes
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
