"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function AddGigButton() {
  const { status } = useSession()
  const router = useRouter()

  const handleAddGigs = () => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else {
      router.push("/add-gigs")
    }
  }

  return (
    <Button
      onClick={handleAddGigs}
      size="sm"
      className="bg-primary text-primary-foreground font-semibold rounded-xl"
    >
      <Plus className="w-4 h-4 mr-1.5" />
      Post Gig
    </Button>
  )
}
