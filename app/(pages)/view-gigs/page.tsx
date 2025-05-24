"use client"

import DisplayAllGigs from "@/components/DisplayAllGigs"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Sparkles, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

function ViewGigs() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <div className="absolute inset-0">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-300" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
          <p className="text-slate-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const handleAddGigs = () => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else {
      router.push("/add-gigs")
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-12 gap-8">
          <div className="space-y-6 flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Discover Opportunities</span>
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 bg-clip-text text-transparent leading-tight">
                Find Your Next
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Perfect Gig
                </span>
              </h1>

              <p className="text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                Discover amazing opportunities, connect with innovative projects, and apply to gigs that perfectly match
                your unique skills and passion.
              </p>
            </div>

          </div>

          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <Button
              onClick={handleAddGigs}
              className="group w-full lg:w-auto bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-blue-700 text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span>Post Your Gig</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <DisplayAllGigs />
    </div>
  )
}

export default ViewGigs
