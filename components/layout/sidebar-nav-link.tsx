"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"

interface SidebarNavLinkProps {
  href: string
  children: React.ReactNode
}

export function SidebarNavLink({ href, children }: SidebarNavLinkProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  // Exact match for home, otherwise check if pathname starts with href (for active sub-pages)
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  const handleClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </SidebarMenuButton>
  )
}
