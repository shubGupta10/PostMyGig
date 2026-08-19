import { Home, Briefcase, LayoutDashboard, Shield, Activity, Sparkles, type LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const publicNavItems: NavItem[] = [
  {
    title: "Find Work",
    href: "/view-gigs",
    icon: Briefcase,
  },
  {
    title: "Success Stories",
    href: "/#success-stories",
    icon: Sparkles,
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
