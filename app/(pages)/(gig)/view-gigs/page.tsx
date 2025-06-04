'use client'

import DisplayAllGigs from "@/components/DisplayAllGigs"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

function ViewGigs() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading your gigs</p>
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
    <div className="w-full min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-12 gap-8">
          <div className="space-y-6 flex-1">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-3xl lg:text-5xl font-bold text-foreground leading-tight">
                Browse Freelance
                <span className="block text-primary">Opportunities</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Explore freelance projects or share your own listing to connect with others quickly.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <Button
              onClick={handleAddGigs}
              className="w-full lg:w-auto bg-gradient-to-r from-secondary-foreground via-secondary-foreground to-secondary-foreground hover:from-secondary-foreground/90 hover:via-secondary-foreground/90 hover:to-secondary-foreground/90 text-secondary px-8 py-5 text-lg font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Post a Gig</span>
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