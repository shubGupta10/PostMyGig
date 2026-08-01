import { Home, Briefcase, LayoutDashboard, Shield, Activity, type LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const publicNavItems: NavItem[] = [
  {
    title: "Browse Gigs",
    href: "/view-gigs",
    icon: Briefcase,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: Activity,
  },
]

export const authenticatedNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
]

export const adminNavItems: NavItem[] = [
  {
    title: "Admin",
    href: "/user/admin/dashboard",
    icon: Shield,
  },
]
