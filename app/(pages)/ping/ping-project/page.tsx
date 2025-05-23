"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle, ArrowLeft, Send, LinkIcon, FileText, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function PingProject() {
  const { data } = useSession()
  const searchParams = useSearchParams();
  const router = useRouter()
  const userId = data?.user?.id as string
  const gigId = searchParams.get("gigId") as string
  const posterId = searchParams.get("posterId") as string
  

  const [formData, setFormData] = useState({
    projectId: gigId,
    userId: "",
    posterId: posterId,
    message: "",
    bestWorkLink: "",
    bestWorkDescription: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (data?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        userId: data.user.id,
      }))
    }
  }, [data])

  const pingProject = async () => {
    if (!formData.message.trim()) {
      setError("Please provide a message to the project owner")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/ping/ping-this-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application")
      }

      setSuccess(result.message || "Application submitted successfully!")

      // Reset form after successful submission
      setFormData((prev) => ({
        ...prev,
        message: "",
        bestWorkLink: "",
        bestWorkDescription: "",
      }))

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/view-gigs")
      }, 2000)
    } catch (error: any) {
      console.error(error)
      setError(error.message || "An error occurred while submitting your application")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gig
        </button>

        <Card className="border border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-slate-200">
            <CardTitle className="text-2xl font-bold text-slate-800">Apply for this Project</CardTitle>
            <CardDescription className="text-slate-600">
              Tell the project owner why you're the perfect fit for this gig
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 pb-2">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-emerald-50 text-emerald-800 border-emerald-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                pingProject()
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-semibold text-slate-700">
                  Your Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you're interested in this project. Highlight relevant skills and experience."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[120px] text-base"
                  required
                />
                <p className="text-xs text-slate-500">
                  This message will be sent to the project owner. Be professional and concise.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bestWorkLink"
                  className="text-base font-semibold text-slate-700 flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4 text-emerald-600" />
                  Portfolio or Best Work Link
                </Label>
                <Input
                  id="bestWorkLink"
                  type="url"
                  placeholder="https://your-portfolio.com or link to your best work"
                  value={formData.bestWorkLink}
                  onChange={(e) => setFormData({ ...formData, bestWorkLink: e.target.value })}
                  className="text-base"
                />
                <p className="text-xs text-slate-500">
                  Share a link to your portfolio, GitHub, or a specific project that showcases your skills.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bestWorkDescription"
                  className="text-base font-semibold text-slate-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Work Description
                </Label>
                <Textarea
                  id="bestWorkDescription"
                  placeholder="Briefly describe your relevant experience or the work you've linked above."
                  value={formData.bestWorkDescription}
                  onChange={(e) => setFormData({ ...formData, bestWorkDescription: e.target.value })}
                  className="min-h-[100px] text-base"
                />
                <p className="text-xs text-slate-500">
                  Explain what makes your work impressive and relevant to this project.
                </p>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-2 pb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-300 text-slate-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={pingProject}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default PingProject
