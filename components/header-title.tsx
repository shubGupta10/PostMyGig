"use client"

import { usePathname } from "next/navigation"

export function HeaderTitle() {
  const pathname = usePathname()

  let title = "Home"

  if (pathname === "/dashboard") {
    title = "Dashboard"
  } else if (pathname.startsWith("/view-gigs")) {
    title = "Gigs"
  } else if (pathname.startsWith("/activity")) {
    title = "Activity"
  } else if (pathname.startsWith("/user/admin/dashboard")) {
    title = "Admin Dashboard"
  } else if (pathname.startsWith("/user/profile")) {
    title = "Profile"
  } else if (pathname.startsWith("/user-gigs")) {
    title = "Manage Gigs"
  } else if (pathname.startsWith("/chat-history") || pathname.startsWith("/chat")) {
    title = "Messages"
  } else if (pathname.startsWith("/add-gigs")) {
    title = "Post a Gig"
  } else if (pathname.startsWith("/auth/login")) {
    title = "Sign In"
  } else if (pathname.startsWith("/auth/register")) {
    title = "Create Account"
  }

  return (
    <h1 className="text-sm sm:text-base font-semibold tracking-tight text-foreground truncate max-w-[130px] sm:max-w-none">
      {title}
    </h1>
  )
}
