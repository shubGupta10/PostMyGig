"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from 'sonner'
import { useGigStore } from "@/store/gigStore"

interface FormData {
  title: string
  description: string
  expiresAt: string
  budget: string
  status: string
}

interface FormErrors {
  [key: string]: string
}

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    return date.toISOString().split('T')[0]
  } catch {
    return ""
  }
}

const parseBudget = (budgetString: string): { currency: string; amount: string } => {
  if (!budgetString) return { currency: "USD", amount: "" }
  
  if (budgetString.startsWith("$")) {
    return {
      currency: "USD",
      amount: budgetString.slice(1)
    }
  } else if (budgetString.startsWith("₹")) {
    return {
      currency: "INR", 
      amount: budgetString.slice(1)
    }
  }
  
  return { currency: "USD", amount: budgetString }
}

function EditGig() {
  const { gigData } = useGigStore()
  
  const params = useParams()
  const gigId = params.gigId
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const parsedBudget = parseBudget(gigData?.budget || "")
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    expiresAt: "",
    budget: "",
    status: "",
  })
  
  const [currency, setCurrency] = useState(parsedBudget.currency)
  const [budgetAmount, setBudgetAmount] = useState(parsedBudget.amount)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (gigData) {
      const parsedBudget = parseBudget(gigData.budget || "")
      
      const newFormData = {
        title: gigData.title || "",
        description: gigData.description || "",
        expiresAt: formatDateForInput(gigData.expiresAt || ""),
        budget: gigData.budget || "",
        status: gigData.status || "",
      }
      
      setFormData(newFormData)
      setCurrency(parsedBudget.currency)
      setBudgetAmount(parsedBudget.amount)
    }
  }, [gigData])

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

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
    if (errors.status) {
      setErrors((prev) => ({
        ...prev,
        status: "",
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = "Deadline is required"
    } else {
      const selectedDate = new Date(formData.expiresAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.expiresAt = "Deadline must be in the future"
      }
    }

    if (!formData.budget || !budgetAmount) {
      newErrors.budget = "Budget is required"
    } else if (parseFloat(budgetAmount) <= 0) {
      newErrors.budget = "Budget must be greater than 0"
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/gigs/edit-gig", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gigId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          expiresAt: formData.expiresAt,
          budget: formData.budget,
          status: formData.status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Gig updated successfully!")
        router.push("/view-gigs")
      } else if (response.status === 401) {
        toast.error("Please login to update this gig")
        router.push("/login")
      } else {
        toast.error(data.message || "Failed to update gig")
      }
    } catch (error) {
      console.error("Error updating gig:", error)
      toast.error("An error occurred while updating the gig")
    } finally {
      setIsLoading(false)
    }
  }

  if (!gigData) {
    return (
      <div className="w-full bg-background min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gig data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-background min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 py-2">
            Edit Your Gig
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Update your gig information to attract the right candidates
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold text-card-foreground">
                Gig Title *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Full Stack Developer for E-commerce Website"
                value={formData.title}
                onChange={handleInputChange}
                className={`text-lg py-6 bg-input border-border text-foreground ${errors.title ? "border-destructive focus:border-destructive" : ""}`}
              />
              {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold text-card-foreground">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail, including requirements, goals, and expectations..."
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`text-lg resize-none bg-input border-border text-foreground ${errors.description ? "border-destructive focus:border-destructive" : ""}`}
              />
              {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-lg font-semibold text-card-foreground">
                Gig Deadline *
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`text-lg py-6 bg-input border-border text-foreground ${errors.expiresAt ? "border-destructive focus:border-destructive" : ""}`}
              />
              {errors.expiresAt && <p className="text-destructive text-sm">{errors.expiresAt}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-lg font-semibold text-card-foreground">
                Budget *
              </Label>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-muted-foreground">Currency:</span>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("USD")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currency === "USD" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("INR")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currency === "INR" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-muted-foreground pointer-events-none">
                  {currency === "USD" ? "$" : "₹"}
                </div>
                <Input
                  id="budget"
                  name="budgetAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder={currency === "USD" ? "500" : "40000"}
                  value={budgetAmount}
                  onChange={handleBudgetChange}
                  className={`text-lg py-6 pl-8 bg-input border-border text-foreground ${errors.budget ? "border-destructive focus:border-destructive" : ""}`}
                />
              </div>

              {formData.budget && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Budget will be saved as: <span className="font-semibold text-foreground">{formData.budget}</span>
                </p>
              )}

              {errors.budget && <p className="text-destructive text-sm">{errors.budget}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-lg font-semibold text-card-foreground">
                Gig Status *
              </Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className={`text-lg py-6 bg-input border-border text-foreground ${errors.status ? "border-destructive focus:border-destructive" : ""}`}>
                  <SelectValue placeholder="Select gig status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed" className="text-lg py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="expired" className="text-lg py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Expired
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-destructive text-sm">{errors.status}</p>}
            </div>

            <div className="pt-6 flex gap-4">
              <Button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Updating Gig..." : "Update Gig"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditGig