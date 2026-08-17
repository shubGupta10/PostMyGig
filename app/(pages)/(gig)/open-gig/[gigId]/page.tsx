import { fetchGigDetails, checkPingStatus } from "./services/gigApi"
import { OpenGigHeader } from "@/components/gigs/open-gig/OpenGigHeader"
import { OpenGigDetails } from "@/components/gigs/open-gig/OpenGigDetails"
import { OpenGigSidebar } from "@/components/gigs/open-gig/OpenGigSidebar"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next"
import { notFound } from "next/navigation"
import { authOptions } from "@/lib/options"
import { isGigAvailableForApplication, getDisabledButtonMessage } from "@/components/gigs/open-gig/utils"
import { Metadata } from "next"
import { buildSocialImageUrl, getBaseUrl } from "@/lib/social-preview"

export async function generateMetadata({ params }: { params: Promise<{ gigId: string }> }): Promise<Metadata> {
  const { gigId } = await params
  const cookieStore = await cookies()
  const cookieString = cookieStore.toString()

  const { gig, error } = await fetchGigDetails(gigId, cookieString)

  if (error || !gig) {
    return {
      title: 'Gig Not Found | PostMyGig',
    }
  }

  const summary = `${gig.budget ? `Budget: ₹${gig.budget} • ` : ''}Skills: ${gig.skillsRequired.slice(0, 3).join(', ')}`;
  const ogImageUrl = buildSocialImageUrl({
    title: gig.title,
    description: summary,
    badge: "Open Gig",
    type: "gig",
  });
  const canonicalUrl = `${getBaseUrl()}/open-gig/${gigId}`;

  return {
    title: `${gig.title} | PostMyGig`,
    description: gig.description.substring(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${gig.title} | PostMyGig`,
      description: summary,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: gig.title,
        },
      ],
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${gig.title} | PostMyGig`,
      description: summary,
      images: [ogImageUrl],
      creator: "@postmygig",
    },
  }
}

export default async function OpenGig({ params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = await params;
  const cookieStore = await cookies()
  const cookieString = cookieStore.toString()

  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email

  const { gig, owner, error } = await fetchGigDetails(gigId, cookieString)

  if (error || !gig) {
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
