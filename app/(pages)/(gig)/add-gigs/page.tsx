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
import FeedbackDialog from "@/modules/admin/components/FeedbackDialog"

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
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
            Post Your <span className="text-primary">Gig</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Share your project details and connect with talented freelancers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8 pb-24">
          {/* Title */}
          <div className="space-y-2.5">
            <Label htmlFor="title" className="text-base font-semibold text-foreground">
              Gig Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Full Stack Developer for E-commerce Website"
              value={formData.title}
              onChange={handleInputChange}
              className={`h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground rounded-2xl px-5 ${errors.title ? "border-destructive focus:border-destructive" : "focus:border-primary"
                }`}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{errors.title}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-base font-semibold text-foreground">
              Project Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project in detail, including requirements, goals, deliverables, and expectations..."
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className={`w-full text-base bg-background border-2 border-border focus:border-primary resize-y placeholder:text-muted-foreground rounded-2xl p-5 leading-relaxed min-h-[180px] ${errors.description ? "border-destructive focus:border-destructive" : ""
                }`}
            />
            {errors.description && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{errors.description}</p>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2.5">
            <Label htmlFor="skillsRequired" className="text-base font-semibold text-foreground">
              Skills Required <span className="text-destructive">*</span>
            </Label>
            <Input
              id="skillsRequired"
              name="skillsRequired"
              type="text"
              placeholder="react, nextjs, nodejs, mongodb"
              value={formData.skillsRequired}
              onChange={handleInputChange}
              className={`h-14 bg-background border-2 border-border text-base placeholder:text-muted-foreground rounded-2xl px-5 ${errors.skillsRequired
                ? "border-destructive focus:border-destructive"
                : "focus:border-primary"
                }`}
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Separate skills with commas (e.g. <code className="bg-muted px-2 py-0.5 rounded text-foreground">react, nextjs, nodejs</code>)
            </p>
            {errors.skillsRequired && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{errors.skillsRequired}</p>
              </div>
            )}
          </div>

          {/* Contact Details Settings */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border-2 border-border bg-muted/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm sm:text-base">
                  {formData.displayContactLinks ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span>Contact Visibility</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {formData.displayContactLinks
                    ? "Your contact details will be visible on the gig page"
                    : "Your contact details will be hidden until someone applies"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  {formData.displayContactLinks ? "Public" : "Private"}
                </span>
                <Switch checked={formData.displayContactLinks} onCheckedChange={handleDisplayContactToggle} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className="h-12 bg-background border-2 border-border text-sm placeholder:text-muted-foreground focus:border-primary rounded-xl px-4"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
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
                  className="h-12 bg-background border-2 border-border text-sm placeholder:text-muted-foreground focus:border-primary rounded-xl px-4"
                />
              </div>

              {/* X (Twitter) */}
              <div className="space-y-2">
                <Label htmlFor="x" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-muted-foreground" />X (Twitter)
                </Label>
                <Input
                  id="x"
                  type="text"
                  placeholder="@username"
                  value={formData.contact.x}
                  onChange={(e) => handleContactChange("x", e.target.value)}
                  className="h-12 bg-background border-2 border-border text-sm placeholder:text-muted-foreground focus:border-primary rounded-xl px-4"
                />
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Deadline */}
            <div className="space-y-2.5">
              <Label htmlFor="expiresAt" className="text-base font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Project Deadline</span>
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`h-14 bg-background border-2 border-border text-base rounded-2xl px-5 ${errors.expiresAt ? "border-destructive focus:border-destructive" : "focus:border-primary"
                  }`}
              />
              {errors.expiresAt && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.expiresAt}</p>
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="budget" className="text-base font-semibold text-foreground">
                  Project Budget
                </Label>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("USD")}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-colors ${currency === "USD" ? "bg-card text-card-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("INR")}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-colors ${currency === "INR" ? "bg-card text-card-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>

              {/* Budget Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base font-bold text-primary">
                  {currency === "USD" ? "$" : "₹"}
                </div>
                <Input
                  id="budget"
                  name="budgetAmount"
                  type="number"
                  placeholder={currency === "USD" ? "500" : "40000"}
                  value={budgetAmount}
                  onChange={handleBudgetChange}
                  className={`h-14 pl-11 pr-5 bg-background border-2 border-border text-base placeholder:text-muted-foreground rounded-2xl ${errors.budget ? "border-destructive focus:border-destructive" : "focus:border-primary"
                    }`}
                />
              </div>

              {errors.budget && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.budget}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary text-primary-foreground font-bold text-base rounded-2xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Gig...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Gig</span>
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