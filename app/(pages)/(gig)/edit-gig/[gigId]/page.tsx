"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

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
}

interface FormErrors {
  [key: string]: string
}

function EditGig() {
  const params = useParams()
  const gigId = params.gigId
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
      const response = await fetch("/api/gigs/edit-gig", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gigId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          contact: formData.contact,
          expiresAt: formData.expiresAt,
          budget: formData.budget,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Gig updated successfully!")
        router.push("/view-gigs")
      } else if (response.status === 401) {
        alert("Please login to update this gig")
        router.push("/login")
      } else {
        alert(data.message || "Failed to update gig")
      }
    } catch (error) {
      console.error("Error updating gig:", error)
      alert("An error occurred while updating the gig")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 py-2">
            Edit Your Gig
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Update your gig information to attract the right candidates
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold text-slate-700">
                Gig Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Full Stack Developer for E-commerce Website"
                value={formData.title}
                onChange={handleInputChange}
                className={`text-lg py-6 ${errors.title ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail, including requirements, goals, and expectations..."
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`text-lg resize-none ${errors.description ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>


            {/* Contact Information Fields */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-slate-700">Contact Information</Label>
              <p className="text-sm text-slate-500">Your Contact Information will be visible on the gig page.</p>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-slate-600">
                  📧 Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className="text-lg py-4"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-base font-medium text-slate-600">
                  💬 WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="+1234567890"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleContactChange("whatsapp", e.target.value)}
                  className="text-lg py-4"
                />
              </div>

              {/* X (Twitter) */}
              <div className="space-y-2">
                <Label htmlFor="x" className="text-base font-medium text-slate-600">
                  🐦 X (Twitter)
                </Label>
                <Input
                  id="x"
                  type="text"
                  placeholder="@username"
                  value={formData.contact.x}
                  onChange={(e) => handleContactChange("x", e.target.value)}
                  className="text-lg py-4"
                />
              </div>

              {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
            </div>

            {/* Expires At Field */}
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-lg font-semibold text-slate-700">
                Gig Deadline
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`text-lg py-6 ${errors.expiresAt ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.expiresAt && <p className="text-red-500 text-sm">{errors.expiresAt}</p>}
            </div>

            {/* Budget Field with Currency Selector */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-lg font-semibold text-slate-700">
                Budget
              </Label>

              {/* Currency Toggle */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-600">Currency:</span>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("USD")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currency === "USD" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("INR")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currency === "INR" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>

              {/* Budget Input with Currency Symbol */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-slate-500 pointer-events-none">
                  {currency === "USD" ? "$" : "₹"}
                </div>
                <Input
                  id="budget"
                  name="budgetAmount"
                  type="number"
                  placeholder={currency === "USD" ? "500" : "40000"}
                  value={budgetAmount}
                  onChange={handleBudgetChange}
                  className={`text-lg py-6 pl-8 ${errors.budget ? "border-red-500 focus:border-red-500" : ""}`}
                />
              </div>

              {/* Show formatted budget */}
              {formData.budget && (
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Budget will be saved as: <span className="font-semibold text-slate-800">{formData.budget}</span>
                </p>
              )}

              {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex gap-4">
              <Button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
