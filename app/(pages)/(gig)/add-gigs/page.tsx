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
import {toast} from 'sonner'

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
        router.push("/view-gigs")
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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Post Your <span className="text-primary">Gig</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl">
            Share your project details and connect with talented freelancers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* Project Information */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
              </div>
              Project Information
            </h3>

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
                className={`text-sm sm:text-base py-2 sm:py-3 bg-input border-border text-foreground placeholder:text-muted-foreground ${
                  errors.title ? "border-destructive focus:border-destructive" : "focus:border-primary"
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
                className={`text-sm sm:text-base resize-none bg-input border-border text-foreground placeholder:text-muted-foreground ${
                  errors.description ? "border-destructive focus:border-destructive" : "focus:border-primary"
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
                className={`text-sm sm:text-base py-2 sm:py-3 bg-input border-border text-foreground placeholder:text-muted-foreground ${
                  errors.skillsRequired
                    ? "border-destructive focus:border-destructive"
                    : "focus:border-primary"
                }`}
              />
              <div className="bg-accent rounded-lg p-3 border border-accent-foreground/20">
                <p className="text-xs sm:text-sm text-accent-foreground">
                  Separate skills with commas:{" "}
                  <code className="bg-card px-2 py-1 rounded text-xs sm:text-sm text-card-foreground">react, nextjs, nodejs</code>
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
              <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
                </div>
                Contact Information
              </h3>
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

            <div className="bg-secondary rounded-lg p-3 border border-secondary-foreground/20">
              <p className="text-xs sm:text-sm text-secondary-foreground">
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
                  className="text-xs sm:text-sm py-2 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
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
                  className="text-xs sm:text-sm py-2 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
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
                  className="text-xs sm:text-sm py-2 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-border">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
              </div>
              Timeline & Budget
            </h3>

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
                  className={`text-sm sm:text-base py-2 sm:py-3 bg-input border-border text-foreground ${
                    errors.expiresAt ? "border-destructive focus:border-destructive" : "focus:border-primary"
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
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                        currency === "USD" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("INR")}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                        currency === "INR" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
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
                    className={`text-sm sm:text-base py-2 sm:py-3 pl-7 sm:pl-8 bg-input border-border text-foreground placeholder:text-muted-foreground ${
                      errors.budget ? "border-destructive focus:border-destructive" : "focus:border-primary"
                    }`}
                  />
                </div>

                {/* Budget Preview */}
                {formData.budget && (
                  <div className="bg-accent rounded-lg p-2 border border-accent-foreground/20">
                    <div className="flex items-center gap-2 text-accent-foreground">
                      <CheckCircle className="w-4 h-4" />
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
              className="w-full sm:w-auto sm:min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
  )
}

export default AddGigs