"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function HeaderTitle() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role || "freelancer"

  let title = "Home"

  if (pathname === "/dashboard") {
    title = "Dashboard"
  } else if (pathname.startsWith("/view-gigs")) {
    title = "Find Work"
  } else if (pathname.startsWith("/activity")) {
    title = "Activity"
  } else if (pathname.startsWith("/user/admin/dashboard")) {
    title = "Admin Dashboard"
  } else if (pathname.startsWith("/user/profile")) {
    title = "Profile"
  } else if (pathname.startsWith("/my-jobs")) {
    title = "My Jobs"
  } else if (pathname.startsWith("/user/proposals")) {
    title = "My Proposals"
  } else if (pathname.startsWith("/chat-history")) {
    title = "Messages"
  } else if (pathname.startsWith("/chat")) {
    title = "Chat"
  } else if (pathname.startsWith("/add-gigs")) {
    title = "Post a Gig"
  } else if (pathname.startsWith("/auth/login")) {
    title = "Sign In"
  } else if (pathname.startsWith("/auth/register")) {
    title = "Create Account"
  } else if (pathname.startsWith("/user/settings")) {
    title = "Settings"
  } else if (pathname.startsWith("/search")) {
    title = userRole === "client" ? "Find Freelancers" : "Find Clients"
  }

  return (
    <h1 className="text-sm sm:text-base font-semibold tracking-tight text-foreground truncate max-w-[130px] sm:max-w-none">
      {title}
    </h1>
  )
}
