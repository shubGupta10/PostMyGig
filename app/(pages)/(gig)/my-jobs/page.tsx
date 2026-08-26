import { cookies } from "next/headers"
import { fetchUserGigs } from "./services"
import { UserGigsList } from "@/modules/gigs/components/UserGigsList"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function UserGigsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10));

  const cookieStore = await cookies()
  const cookieString = cookieStore.toString();

  const result = await fetchUserGigs(cookieString, currentPage, 6);

  if (result.error) {
    throw new Error(result.error)
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10 w-full min-w-0 max-w-full">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full min-w-0">
        <UserGigsList initialProjects={result.gigs} pagination={result.pagination} />
      </div>
    </div>
  )
}