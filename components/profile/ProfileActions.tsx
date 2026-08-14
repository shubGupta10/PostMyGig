"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Edit, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/userDataStore"
import type { UserData } from "@/app/user/profile/[userId]/types"

export function ProfileActions({ userData }: { userData: UserData }) {
  const session = useSession()
  const router = useRouter()
  const { setUserData: StoreUserDataIntoStore } = useUserStore()

  useEffect(() => {
    StoreUserDataIntoStore(userData)
  }, [userData, StoreUserDataIntoStore])

  // SECURITY: Only render these actions if the logged-in user is the owner of this profile
  if (session.status !== "authenticated" || session.data?.user?.id !== userData._id) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Account Actions */}
      <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
        <div className="p-6 space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Actions</p>

          <Button onClick={() => router.push(`/user/edit/?userId=${userData._id}`)} className="w-full bg-primary text-primary-foreground font-semibold h-11">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          
          <Button onClick={() => router.push(`/user/settings`)} variant="outline" className="w-full border-border text-foreground hover:bg-muted font-semibold h-11">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
