"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  Star,
  Mail,
  MessageCircle,
  Twitter,
  Eye,
  EyeOff,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
} from "lucide-react"
import { toast } from 'sonner'
import FeedbackDialog from "@/components/FeedbackDialog"

interface FormData {
  title: string
  description: string
  skillsRequired: string
  contact: {
    email: string
    whatsapp: string
    x: string
  }
  expiresAt: string
  budget: string
  displayContactLinks: boolean
}

interface FormErrors {
  [key: string]: string
}

function AddGigs() {
  const router = useRouter()
  const [showFeedbackDailog, setShowFeedbackDailog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    skillsRequired: "",
    contact: {
      email: "",
      whatsapp: "",
      x: "",
    },
    expiresAt: "",
    budget: "",
    displayContactLinks: true,
  })
  const [currency, setCurrency] = useState("USD")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleContactChange = (type: "email" | "whatsapp" | "x", value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [type]: value,
      },
    }))

    if (errors.contact) {
      setErrors((prev) => ({
        ...prev,
        contact: "",
      }))
    }
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    setBudgetAmount(amount)

    const currencySymbol = currency === "USD" ? "$" : "₹"
    setFormData((prev) => ({
      ...prev,
      budget: amount ? `${currencySymbol}${amount}` : "",
    }))

    if (errors.budget) {
      setErrors((prev) => ({
        ...prev,
        budget: "",
      }))
    }
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)

    if (budgetAmount) {
      const currencySymbol = newCurrency === "USD" ? "$" : "₹"
      setFormData((prev) => ({
        ...prev,
        budget: `${currencySymbol}${budgetAmount}`,
      }))
    }
  }

  const handleDisplayContactToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      displayContactLinks: checked,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.skillsRequired.trim()) {
      newErrors.skillsRequired = "Skills are required"
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = "Deadline is required"
    }

    if (!formData.budget) {
      newErrors.budget = "Budget is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const skillsArray = formData.skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      const response = await fetch("/api/gigs/add-gigs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          skillsRequired: skillsArray,
          contact: formData.contact,
          expiresAt: formData.expiresAt,
          budget: formData.budget,
          displayContactLinks: formData.displayContactLinks,
        }),
      })

      const data = await response.json()

      if (response.status === 201) {
        toast.success("Gig created successfully!")
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("refresh-notification"));
        }
        setFormData({
          title: "",
          description: "",
          skillsRequired: "",
          contact: {
            email: "",
            whatsapp: "",
            x: "",
          },
          expiresAt: "",
          budget: "",
          displayContactLinks: true,
        })
        setBudgetAmount("")
        setCurrency("USD")
        setShowFeedbackDailog(true)

      } else if (response.status === 401) {
        toast.error("Please login to create a gig")
        router.push("/auth/login")
      } else {
        alert(data.message || "Failed to create gig")
      }
    } catch (error) {
      console.error("Error creating gig:", error)
      toast.error("An error occurred while creating the gig")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Post Your <span className="text-primary">Gig</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            Share your project details and connect with talented freelancers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 max-w-3xl">
          {/* Project Information */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Project Information
            </p>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base font-semibold text-foreground">
                Gig Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Full Stack Developer for E-commerce Website"
                value={formData.title}
                onChange={handleInputChange}
                className={`h-11 bg-background border-border text-sm placeholder:text-muted-foreground ${errors.title ? "border-destructive focus:border-destructive" : "focus:border-primary"
                  }`}
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{errors.title}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base font-semibold text-foreground">
                Project Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail, including requirements, goals, and expectations..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`text-sm bg-background border-2 border-border focus:border-primary resize-none placeholder:text-muted-foreground ${errors.description ? "border-destructive focus:border-destructive" : ""
                  }`}
              />
              {errors.description && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{errors.description}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skillsRequired" className="text-sm sm:text-base font-semibold text-foreground">
                Skills Required
              </Label>
              <Input
                id="skillsRequired"
                name="skillsRequired"
                type="text"
                placeholder="react, nextjs, nodejs, mongodb"
                value={formData.skillsRequired}
                onChange={handleInputChange}
                className={`h-11 bg-background border-border text-sm placeholder:text-muted-foreground ${errors.skillsRequired
                  ? "border-destructive focus:border-destructive"
                  : "focus:border-primary"
                  }`}
              />
              <div className="bg-muted rounded-xl p-4 border border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Separate skills with commas:{" "}
                  <code className="bg-background px-2 py-1 rounded text-xs sm:text-sm text-foreground border border-border">react, nextjs, nodejs</code>
                </p>
              </div>
              {errors.skillsRequired && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{errors.skillsRequired}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Contact Information
              </p>
              <div className="flex items-center gap-3 bg-muted rounded-lg px-3 sm:px-4 py-2">
                <div className="flex items-center gap-2">
                  {formData.displayContactLinks ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {formData.displayContactLinks ? "Public" : "Private"}
                  </span>
                </div>
                <Switch checked={formData.displayContactLinks} onCheckedChange={handleDisplayContactToggle} />
              </div>
            </div>

            <div className="bg-muted rounded-xl p-4 border border-border">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formData.displayContactLinks
                  ? "Your contact details will be visible on the gig page"
                  : "Your contact details will be hidden until someone applies"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-primary" />
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="+1234567890"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleContactChange("whatsapp", e.target.value)}
                  className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {/* X (Twitter) */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="x" className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-muted-foreground" />X (Twitter)
                </Label>
                <Input
                  id="x"
                  type="text"
                  placeholder="@username"
                  value={formData.contact.x}
                  onChange={(e) => handleContactChange("x", e.target.value)}
                  className="h-11 bg-background border-border text-sm placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Timeline & Budget
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="expiresAt" className="text-sm sm:text-base font-semibold text-foreground">
                  Project Deadline
                </Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`h-11 bg-background border-border text-sm ${errors.expiresAt ? "border-destructive focus:border-destructive" : "focus:border-primary"
                    }`}
                />
                {errors.expiresAt && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{errors.expiresAt}</p>
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm sm:text-base font-semibold text-foreground">
                  Project Budget
                </Label>

                {/* Currency Toggle */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Currency:</span>
                  <div className="flex bg-muted rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("USD")}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${currency === "USD" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("INR")}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${currency === "INR" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      INR (₹)
                    </button>
                  </div>
                </div>

                {/* Budget Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm sm:text-base font-semibold text-primary">
                    {currency === "USD" ? "$" : "₹"}
                  </div>
                  <Input
                    id="budget"
                    name="budgetAmount"
                    type="number"
                    placeholder={currency === "USD" ? "500" : "40000"}
                    value={budgetAmount}
                    onChange={handleBudgetChange}
                    className={`h-11 pl-7 sm:pl-8 bg-background border-border text-sm placeholder:text-muted-foreground ${errors.budget ? "border-destructive focus:border-destructive" : "focus:border-primary"
                      }`}
                  />
                </div>

                {/* Budget Preview */}
                {formData.budget && (
                  <div className="bg-muted rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-xs sm:text-sm">
                        Budget: <strong>{formData.budget}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {errors.budget && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{errors.budget}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 sm:pt-8 border-t border-border">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Creating Gig...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Gig
                </div>
              )}
            </Button>
          </div>
          </form>
        </div>
      </div>
      {/* feedback dailog */}
      <FeedbackDialog
        open={showFeedbackDailog}
        onClose={() => {
          setShowFeedbackDailog(false)
          router.push("/view-gigs")
        }}
      />
    </>
  )
}

export default AddGigs