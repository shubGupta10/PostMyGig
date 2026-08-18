import type { Metadata } from "next"
import DisplayAllGigs from "@/components/DisplayAllGigs"
import GigFilters from "@/components/gigs/GigFilters"
import { getAllUniqueSkills } from "../services/gigService"
import { getBaseUrl } from "@/lib/social-preview"

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: "Browse Freelance Gigs | PostMyGig",
  description: "Explore active freelance gigs in tech, design, and software development. Pitch directly with direct chat.",
  openGraph: {
    title: "Browse Freelance Gigs | PostMyGig",
    description: "Explore active freelance gigs in tech, design, and software development. Pitch directly with direct chat.",
    url: `${baseUrl}/view-gigs`,
    siteName: "PostMyGig",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PostMyGig – Browse Freelance Gigs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Freelance Gigs | PostMyGig",
    description: "Explore active freelance gigs in tech, design, and software development. Pitch directly with direct chat.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@postmygig",
  },
}

export default async function ViewGigs({
  searchParams
}: {
  searchParams: Promise<{ page?: string, search?: string, skill?: string, sort?: string }>
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const currentSearch = params.search || "";
  const currentSkill = params.skill || "";
  const currentSort = params.sort || "";

  // Fetch all unique skills currently present in active gigs
  const availableSkills = await getAllUniqueSkills();

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <GigFilters
          availableSkills={availableSkills}
          currentSearch={currentSearch}
          currentSkill={currentSkill}
          currentSort={currentSort}
        />

        <DisplayAllGigs page={currentPage} search={currentSearch} skill={currentSkill} sort={currentSort} />
      </div>
    </div>
  )
}
