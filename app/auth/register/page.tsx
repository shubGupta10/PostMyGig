"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, User, Mail, Lock, Eye, EyeOff, CheckCircle, Github, ArrowRight, Users, Briefcase, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RateLimitInfo {
  isLimited: boolean
  retryAfter: string | null
  message: string
  timestamp: number
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    isLimited: false,
    retryAfter: null,
    message: "",
    timestamp: 0,
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setError("")
    // Clear rate limit info when user starts typing
    if (rateLimitInfo.isLimited) {
      setRateLimitInfo((prev) => ({ ...prev, isLimited: false, message: "" }))
    }
  }

  const handleRateLimit = (retryAfter: string) => {
    const rateLimitMessage = `Too many registration attempts. Please wait ${retryAfter} seconds before trying again.`
    
    setRateLimitInfo({
      isLimited: true,
      retryAfter,
      message: rateLimitMessage,
      timestamp: Date.now(),
    })
    
    setError(rateLimitMessage)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Check if still rate limited
    if (rateLimitInfo.isLimited) {
      setError(`Please wait! You're still rate limited. Try again in ${rateLimitInfo.retryAfter || "a few"} seconds.`)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Check if the error indicates rate limiting
        if (response.status === 429 || data.message?.includes("rate") || data.message?.includes("limit")) {
          const retryAfter = response.headers.get("Retry-After") || "60"
          handleRateLimit(retryAfter)
        } else {
          throw new Error(data.message || "Registration failed")
        }
        return
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        // Check if the sign-in error indicates rate limiting
        if (result.error.includes("rate") || result.error.includes("limit") || result.error.includes("429")) {
          handleRateLimit("60")
        } else {
          setError(result.error)
        }
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (rateLimitInfo.isLimited) {
      setError(`Please wait! You're still rate limited. Try again in ${rateLimitInfo.retryAfter || "a few"} seconds.`)
      return
    }

    try {
      const result = await signIn("google", { callbackUrl: `/`, redirect: true })

      if (result?.error) {
        if (result.error.includes("rate") || result.error.includes("limit") || result.error.includes("429")) {
          handleRateLimit("60")
        } else {
          setError("Failed to sign in with Google")
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("An unexpected error occurred")
    }
  }

  const handleGitHubSignIn = async () => {
    if (rateLimitInfo.isLimited) {
      setError(`Please wait! You're still rate limited. Try again in ${rateLimitInfo.retryAfter || "a few"} seconds.`)
      return
    }

    try {
      const result = await signIn("github", { callbackUrl: `/`, redirect: true })
      
      if (result?.error) {
        if (result.error.includes("rate") || result.error.includes("limit") || result.error.includes("429")) {
          handleRateLimit("60")
        } else {
          setError("Failed to sign in with GitHub")
        }
      }
    } catch (error) {
      console.error("GitHub sign-in error:", error)
      setError("An unexpected error occurred")
    }
  }

  // Rate Limit Banner Component
  const RateLimitBanner = () => {
    if (!rateLimitInfo.isLimited) return null

    return (
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-800 mb-1">Registration Rate Limit Exceeded</h4>
            <p className="text-amber-700 text-sm leading-relaxed">{rateLimitInfo.message}</p>
            <div className="mt-2 text-xs text-amber-600">
              <strong>Tip:</strong> Wait for the cooldown period before attempting to register again.
            </div>
            {/* Rate Limit Details */}
            <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-3 mt-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-amber-700 font-medium">Status:</span>
                  <span className="text-amber-800">Rate Limited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700 font-medium">Retry After:</span>
                  <span className="text-amber-800">{rateLimitInfo.retryAfter || "Unknown"} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700 font-medium">Time:</span>
                  <span className="text-amber-800">{new Date(rateLimitInfo.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[700px]">
          {/* Left Panel - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="max-w-md w-full">
              {/* Rate Limit Banner */}
              <RateLimitBanner />

              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Create Account ✨</h1>
                <p className="text-gray-600 text-lg">Join thousands of freelancers and clients worldwide.</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert
                  variant="destructive"
                  className={`mb-6 ${
                    rateLimitInfo.isLimited 
                      ? "border-amber-200 bg-amber-50" 
                      : "border-red-200 bg-red-50"
                  } animate-in fade-in-50 duration-300 rounded-xl`}
                >
                  {rateLimitInfo.isLimited ? (
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <AlertDescription className={`${
                    rateLimitInfo.isLimited ? "text-amber-800" : "text-red-800"
                  } ml-2 font-medium`}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading || rateLimitInfo.isLimited}
                      placeholder="Enter your full name"
                      className={`pl-12 h-14 border-2 ${
                        rateLimitInfo.isLimited 
                          ? "border-amber-200 bg-amber-50/30" 
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      } rounded-xl text-base font-medium transition-all duration-200`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading || rateLimitInfo.isLimited}
                      placeholder="Enter your email address"
                      className={`pl-12 h-14 border-2 ${
                        rateLimitInfo.isLimited 
                          ? "border-amber-200 bg-amber-50/30" 
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      } rounded-xl text-base font-medium transition-all duration-200`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading || rateLimitInfo.isLimited}
                      placeholder="Create a strong password"
                      className={`pl-12 pr-12 h-14 border-2 ${
                        rateLimitInfo.isLimited 
                          ? "border-amber-200 bg-amber-50/30" 
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      } rounded-xl text-base font-medium transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={rateLimitInfo.isLimited}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <Button
                  type="submit"
                  className={`w-full h-14 ${
                    rateLimitInfo.isLimited
                      ? "bg-amber-400 hover:bg-amber-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  } text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  disabled={isLoading || rateLimitInfo.isLimited}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : rateLimitInfo.isLimited ? (
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5" />
                      Rate Limited - Please Wait
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or, Sign up with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className={`h-14 border-2 ${
                    rateLimitInfo.isLimited
                      ? "border-amber-200 bg-amber-50/30 cursor-not-allowed"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                  } rounded-xl font-semibold text-gray-700 transition-all duration-200 shadow-sm`}
                  disabled={isLoading || rateLimitInfo.isLimited}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  onClick={handleGitHubSignIn}
                  variant="outline"
                  className={`h-14 border-2 ${
                    rateLimitInfo.isLimited
                      ? "border-amber-200 bg-amber-50/30 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
                  } rounded-xl font-semibold text-gray-700 transition-all duration-200 shadow-sm`}
                  disabled={isLoading || rateLimitInfo.isLimited}
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                >
                  Log in here
                </a>
              </p>
            </div>
          </div>

          {/* Right Panel - Image */}
          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/30 to-blue-600/20 z-10"></div>

            {/* Background Image */}
            <div className="h-full w-full bg-[url('https://images.pexels.com/photos/3153204/pexels-photo-3153204.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center z-20">
              <div className="max-w-md">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                  <Users className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-6 leading-tight">
                  Join Our Amazing
                  <span className="text-emerald-300"> Community</span>
                </h2>

                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Connect with talented freelancers and ambitious clients. Build your network, grow your business, and achieve your goals together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}