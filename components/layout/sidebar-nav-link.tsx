"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"

interface SidebarNavLinkProps {
  href: string
  children: React.ReactNode
  activePatterns?: string[]
}

export function SidebarNavLink({ href, children, activePatterns }: SidebarNavLinkProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  // Exact match for home, otherwise check if pathname starts with href or any activePatterns
  const patterns = activePatterns ? [href, ...activePatterns] : [href]
  const isActive = href === "/" 
    ? pathname === href 
    : patterns.some(p => pathname.startsWith(p))

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
