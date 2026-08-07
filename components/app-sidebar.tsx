import * as React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  User2Icon,
  MessageCircleCodeIcon,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Briefcase,
  Send,
  Activity,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarUserMenu } from "./sidebar-user-menu"
import { SidebarNavLink } from "./sidebar-nav-link"

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession(authOptions)
  const userRole = session?.user?.role || "freelancer"
  const isAdmin = userRole === "admin"

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
                  <Image unoptimized src="/AppIcon.png" alt="App Icon" width={32} height={32} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-lg text-foreground">
                    PostMy<span className="text-primary">Gig</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Client Navigation */}
              {session && userRole === "client" && (
                <>
                  <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard">
                      <LayoutDashboard className="size-4" />
                      <span>Dashboard</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                </>
              )}

              {/* Freelancer Navigation */}
              {session && userRole === "freelancer" && (
                <>
                  <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard">
                      <LayoutDashboard className="size-4" />
                      <span>Dashboard</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                </>
              )}

              {/* Shared Navigation (Available to both Client & Freelancer) */}
              <SidebarMenuItem>
                <SidebarNavLink href="/view-gigs">
                  <Briefcase className="size-4" />
                  <span>Browse Gigs</span>
                </SidebarNavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarNavLink href="/activity">
                  <Activity className="size-4" />
                  <span>Activity</span>
                </SidebarNavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {session && (
          <SidebarGroup>
            <SidebarGroupLabel>Personal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarNavLink href={`/user/profile/${session.user.id}`}>
                    <User className="size-4" />
                    <span>Profile</span>
                  </SidebarNavLink>
                </SidebarMenuItem>

                {/* Only clients have posted gigs to manage */}
                {userRole === "client" && (
                  <SidebarMenuItem>
                    <SidebarNavLink href="/user-gigs">
                      <User2Icon className="size-4" />
                      <span>Manage Gigs</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                )}

                {/* Freelancers have Application History */}
                {userRole === "freelancer" && (
                  <SidebarMenuItem>
                    <SidebarNavLink href="/user/application-history">
                      <FileText className="size-4" />
                      <span>Application History</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                )}

                <SidebarMenuItem>
                  <SidebarNavLink href="/chat-history">
                    <MessageCircleCodeIcon className="size-4" />
                    <span>Messages</span>
                  </SidebarNavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarNavLink href="/user/feedback">
                    <MessageSquare className="size-4" />
                    <span>Feedback</span>
                  </SidebarNavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {session && isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarNavLink href="/user/admin/dashboard">
                    <Shield className="size-4" />
                    <span>Admin Dashboard</span>
                  </SidebarNavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

