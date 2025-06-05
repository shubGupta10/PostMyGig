"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, User, Mail, Lock, Eye, EyeOff, CheckCircle, Github, ArrowRight, Users, ShieldAlert, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface RateLimitInfo {
  isLimited: boolean
  retryAfter: string | null
  message: string
  timestamp: number
}

interface EmailCooldownInfo {
  isActive: boolean
  remainingTime: number
  email: string
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
  const [emailCooldown, setEmailCooldown] = useState<EmailCooldownInfo>({
    isActive: false,
    remainingTime: 0,
    email: ""
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
    if (rateLimitInfo.isLimited) {
      setRateLimitInfo((prev) => ({ ...prev, isLimited: false, message: "" }))
    }
    // Clear email cooldown if email changes
    if (id === "email" && emailCooldown.isActive && emailCooldown.email !== value) {
      setEmailCooldown({ isActive: false, remainingTime: 0, email: "" })
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
    toast.error("Rate Limited", {
      description: rateLimitMessage,
      duration: 5000,
    })
  }

  const handleEmailCooldown = (email: string, cooldownSeconds: number = 120) => {
    setEmailCooldown({
      isActive: true,
      remainingTime: cooldownSeconds,
      email: email
    })

    // Start countdown
    const interval = setInterval(() => {
      setEmailCooldown(prev => {
        if (prev.remainingTime <= 1) {
          clearInterval(interval)
          toast.success("Email Cooldown Expired", {
            description: "You can now request another verification email.",
          })
          return { isActive: false, remainingTime: 0, email: "" }
        }
        return { ...prev, remainingTime: prev.remainingTime - 1 }
      })
    }, 1000)

    const cooldownMessage = `Please wait ${Math.floor(cooldownSeconds / 60)}:${(cooldownSeconds % 60).toString().padStart(2, '0')} before requesting another verification email.`
    toast.warning("Email Cooldown Active", {
      description: cooldownMessage,
      duration: 5000,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (rateLimitInfo.isLimited) {
      const message = `Please wait! You're still rate limited. Try again in ${rateLimitInfo.retryAfter || "a few"} seconds.`
      setError(message)
      toast.error("Rate Limited", { description: message })
      return
    }

    if (emailCooldown.isActive && emailCooldown.email === formData.email) {
      const minutes = Math.floor(emailCooldown.remainingTime / 60)
      const seconds = emailCooldown.remainingTime % 60
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
      const message = `Email cooldown active. Please wait ${timeString} before trying again.`
      setError(message)
      toast.warning("Email Cooldown Active", { description: message })
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
        if (response.status === 429) {
          // Check if it's rate limit or email cooldown
          if (data.message?.toLowerCase().includes("verification email") || 
              data.message?.toLowerCase().includes("cooldown")) {
            // Email cooldown
            handleEmailCooldown(formData.email)
            setError(data.message)
          } else {
            // General rate limit
            const retryAfter = response.headers.get("Retry-After") || "60"
            handleRateLimit(retryAfter)
          }
        } else {
          const errorMessage = data.message || "Registration failed"
          setError(errorMessage)
          toast.error("Registration Failed", { description: errorMessage })
        }
        return
      }

      if (data.userId) {
        toast.success("Verification Email Sent!", {
          description: "Please check your email for the verification code.",
          duration: 5000,
        })
        router.push(`/auth/verify-code/${data.userId}`)
      } else {
        const errorMessage = "Registration failed. Please try again."
        setError(errorMessage)
        toast.error("Registration Failed", { description: errorMessage })
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      setError(errorMessage)
      toast.error("Registration Failed", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (rateLimitInfo.isLimited) {
      const message = `Please wait! You're still rate limited. Try again in ${rateLimitInfo.retryAfter || "a few"} seconds.`
      setError(message)
      toast.error("Rate Limited", { description: message })
      return
    }

    try {
      const result = await signIn("google", { callbackUrl: `/`, redirect: true })

      if (result?.error) {
        if (result.error.includes("rate") || result.error.includes("limit") || result.error.includes("429")) {
          handleRateLimit("60")
        } else {
          const errorMessage = "Failed to sign in with Google"
          setError(errorMessage)
          toast.error("Google Sign In Failed", { description: errorMessage })
        }
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred"
      setError(errorMessage)
      toast.error("Sign In Error", { description: errorMessage })
    }
  }

  const handleGitHubSignIn = async () => {
    if (rateLimitInfo.isLimited) {
      const message = `Please wait! You're still rate limited. Try again in ${rateLimitInfo.retryAfter || "a few"} seconds.`
      setError(message)
      toast.error("Rate Limited", { description: message })
      return
    }

    try {
      const result = await signIn("github", { callbackUrl: `/`, redirect: true })

      if (result?.error) {
        if (result.error.includes("rate") || result.error.includes("limit") || result.error.includes("429")) {
          handleRateLimit("60")
        } else {
          const errorMessage = "Failed to sign in with GitHub"
          setError(errorMessage)
          toast.error("GitHub Sign In Failed", { description: errorMessage })
        }
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred"
      setError(errorMessage)
      toast.error("Sign In Error", { description: errorMessage })
    }
  }

  const RateLimitBanner = () => {
    if (!rateLimitInfo.isLimited) return null

    return (
      <div className="mb-6 bg-secondary border border-accent rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-secondary-foreground mb-1">Registration Rate Limit Exceeded</h4>
            <p className="text-secondary-foreground text-sm leading-relaxed">{rateLimitInfo.message}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              <strong>Tip:</strong> Wait for the cooldown period before attempting to register again.
            </div>
            <div className="bg-accent border border-accent rounded-lg p-3 mt-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-accent-foreground font-medium">Status:</span>
                  <span className="text-accent-foreground">Rate Limited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-foreground font-medium">Retry After:</span>
                  <span className="text-accent-foreground">{rateLimitInfo.retryAfter || "Unknown"} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-foreground font-medium">Time:</span>
                  <span className="text-accent-foreground">{new Date(rateLimitInfo.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const EmailCooldownBanner = () => {
    if (!emailCooldown.isActive) return null

    const minutes = Math.floor(emailCooldown.remainingTime / 60)
    const seconds = emailCooldown.remainingTime % 60
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`

    return (
      <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 dark:bg-orange-950/20 dark:border-orange-800/50">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Email Verification Cooldown</h4>
            <p className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed">
              To prevent spam, there's a cooldown period between verification email requests for the same email address.
            </p>
            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
              <strong>Email:</strong> {emailCooldown.email}
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-orange-800 dark:text-orange-200 font-medium">Status:</span>
                  <span className="text-orange-800 dark:text-orange-200">Email Cooldown Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800 dark:text-orange-200 font-medium">Time Remaining:</span>
                  <span className="text-orange-800 dark:text-orange-200 font-mono text-sm">{timeString}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800 dark:text-orange-200 font-medium">Next Attempt:</span>
                  <span className="text-orange-800 dark:text-orange-200">
                    {new Date(Date.now() + emailCooldown.remainingTime * 1000).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isFormDisabled = isLoading || rateLimitInfo.isLimited || (emailCooldown.isActive && emailCooldown.email === formData.email)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-card rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[700px]">
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="max-w-md w-full">
              <RateLimitBanner />
              <EmailCooldownBanner />

              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Create Account ✨</h1>
                <p className="text-muted-foreground text-lg">Join thousands of freelancers and clients worldwide.</p>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className={`mb-6 ${
                    rateLimitInfo.isLimited
                      ? "border-accent bg-secondary"
                      : emailCooldown.isActive
                      ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20"
                      : "border-destructive bg-destructive/10"
                  } animate-in fade-in-50 duration-300 rounded-xl`}
                >
                  {rateLimitInfo.isLimited ? (
                    <ShieldAlert className="h-5 w-5 text-secondary-foreground" />
                  ) : emailCooldown.isActive ? (
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <AlertDescription className={`${
                    rateLimitInfo.isLimited 
                      ? "text-secondary-foreground" 
                      : emailCooldown.isActive
                      ? "text-orange-700 dark:text-orange-300"
                      : "text-destructive"
                  } ml-2 font-medium`}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isFormDisabled}
                      placeholder="Enter your full name"
                      className={`pl-12 h-14 border-2 ${
                        isFormDisabled
                          ? "border-accent bg-secondary"
                          : "border-border focus:border-primary focus:ring-primary"
                      } rounded-xl text-base font-medium transition-all duration-200`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isFormDisabled}
                      placeholder="Enter your email address"
                      className={`pl-12 h-14 border-2 ${
                        isFormDisabled
                          ? "border-accent bg-secondary"
                          : "border-border focus:border-primary focus:ring-primary"
                      } rounded-xl text-base font-medium transition-all duration-200`}
                    />
                  </div>
                  {emailCooldown.isActive && emailCooldown.email === formData.email && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Email cooldown active - try again in {Math.floor(emailCooldown.remainingTime / 60)}:{(emailCooldown.remainingTime % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isFormDisabled}
                      placeholder="Create a strong password"
                      className={`pl-12 pr-12 h-14 border-2 ${
                        isFormDisabled
                          ? "border-accent bg-secondary"
                          : "border-border focus:border-primary focus:ring-primary"
                      } rounded-xl text-base font-medium transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isFormDisabled}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                </div>

                <Button
                  type="submit"
                  className={`w-full h-14 ${
                    isFormDisabled
                      ? "bg-secondary hover:bg-secondary cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 hover:shadow-xl transform hover:-translate-y-0.5"
                  } text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  disabled={isFormDisabled}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : rateLimitInfo.isLimited ? (
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5" />
                      Rate Limited - Please Wait
                    </div>
                  ) : emailCooldown.isActive && emailCooldown.email === formData.email ? (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      Email Cooldown Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-medium">Or, Sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className={`h-14 border-2 ${
                    rateLimitInfo.isLimited
                      ? "border-accent bg-secondary cursor-not-allowed"
                      : "border-border hover:border-primary hover:bg-accent hover:shadow-md"
                  } rounded-xl font-semibold text-foreground transition-all duration-200 shadow-sm`}
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
                      ? "border-accent bg-secondary cursor-not-allowed"
                      : "border-border hover:border-muted hover:bg-muted hover:shadow-md"
                  } rounded-xl font-semibold text-foreground transition-all duration-200 shadow-sm`}
                  disabled={isLoading || rateLimitInfo.isLimited}
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </div>

              <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                >
                  Log in here
                </a>
              </p>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/20 z-10"></div>

            <div className="h-full w-full bg-[url('https://images.pexels.com/photos/3153204/pexels-photo-3153204.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-primary-foreground p-12 text-center z-20">
              <div className="max-w-md">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>

                <h2 className="text-3xl font-bold mb-6 leading-tight">
                  Join Our Amazing
                  <span className="text-accent-foreground"> Community</span>
                </h2>

                <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
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