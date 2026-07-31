import { cookies } from "next/headers"
import { fetchUserGigs } from "./services"
import { UserGigsList } from "@/components/gigs/UserGigsList"

export default async function UserGigsPage() {
  const cookieStore = cookies()
  const cookieString = cookieStore.toString()
  
  const result = await fetchUserGigs(cookieString)

  if (result.error) {
    throw new Error(result.error)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <UserGigsList initialProjects={result.gigs} />
      </div>
    </div>
  )
}