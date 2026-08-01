import * as React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import { publicNavItems, authenticatedNavItems, adminNavItems } from "@/config/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, User2Icon, MessageCircleCodeIcon, MessageSquare } from "lucide-react"

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
  const isAdmin = session?.user?.role === "admin"

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
                  <Image src="/AppIcon.png" alt="App Icon" width={32} height={32} />
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
              {session && authenticatedNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarNavLink href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarNavLink>
                </SidebarMenuItem>
              ))}

              {publicNavItems
                .filter((item) => (session ? item.title !== "Home" : true))
                .map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarNavLink href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                ))}
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
                <SidebarMenuItem>
                  <SidebarNavLink href="/user-gigs">
                    <User2Icon className="size-4" />
                    <span>Manage Gigs</span>
                  </SidebarNavLink>
                </SidebarMenuItem>
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
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarNavLink href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarNavLink>
                  </SidebarMenuItem>
                ))}
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
