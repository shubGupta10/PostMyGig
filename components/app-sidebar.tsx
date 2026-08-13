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
  const isAdmin = (session?.user as any)?.isAdmin === true

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
                  <Image unoptimized src="/AppIcon.png" alt="App Icon" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-bold text-lg text-foreground">
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
          <SidebarGroupLabel className="tracking-normal">Application</SidebarGroupLabel>
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
                  <span>Find Work</span>
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
            <SidebarGroupLabel className="tracking-normal">Personal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarNavLink href={`/user/profile/${session.user.id}`}>
                    <User className="size-4" />
                    <span>Profile Settings</span>
                  </SidebarNavLink>
                </SidebarMenuItem>

                {/* Only clients have posted gigs to manage */}
                {userRole === "client" && (
                  <SidebarMenuItem>
                    <SidebarNavLink href="/my-jobs">
                      <Briefcase className="size-4" />
                      <span>My Jobs</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                )}

                {/* Freelancers have My Proposals */}
                {userRole === "freelancer" && (
                  <SidebarMenuItem>
                    <SidebarNavLink href="/user/proposals">
                      <FileText className="size-4" />
                      <span>My Proposals</span>
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
            <SidebarGroupLabel className="tracking-normal">Admin</SidebarGroupLabel>
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

