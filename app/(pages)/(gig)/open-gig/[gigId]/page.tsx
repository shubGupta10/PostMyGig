import { fetchGigDetails, checkPingStatus } from "./services/gigApi"
import { OpenGigHeader } from "@/components/gigs/open-gig/OpenGigHeader"
import { OpenGigDetails } from "@/components/gigs/open-gig/OpenGigDetails"
import { OpenGigSidebar } from "@/components/gigs/open-gig/OpenGigSidebar"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next"
import { notFound } from "next/navigation"
import { authOptions } from "@/lib/options"
import { isGigAvailableForApplication, getDisabledButtonMessage } from "@/components/gigs/open-gig/utils"

export default async function OpenGig({ params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = await params;
  const cookieStore = cookies()
  const cookieString = cookieStore.toString()

  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email

  const { gig, owner, error } = await fetchGigDetails(gigId, cookieString)

  if (error) {
    throw new Error(error)
  }

  if (!gig) {
    notFound()
  }

  let isPinged = false
  if (userEmail) {
    isPinged = await checkPingStatus(gigId, userEmail, cookieString)
  }

  const canApply = isGigAvailableForApplication(gig.status, gig.expiresAt)
  const disabledMessage = getDisabledButtonMessage(gig.status, gig.expiresAt)

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <OpenGigHeader
        gig={gig}
        owner={owner}
        isPinged={isPinged}
        canApply={canApply}
        disabledMessage={disabledMessage}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <OpenGigDetails gig={gig} />
          <OpenGigSidebar
            gig={gig}
            owner={owner}
            isPinged={isPinged}
            canApply={canApply}
            disabledMessage={disabledMessage}
          />
        </div>
      </div>
    </div>
  )
}
