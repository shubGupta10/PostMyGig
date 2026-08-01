"use client"

import { LogOut, ChevronsUpDown } from "lucide-react"
import { Session } from "next-auth"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function SidebarUserMenu({ session }: { session: Session | null }) {
  const router = useRouter()
  const { handleLogout } = useAuthStore()

  if (!session) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col gap-2 p-2">
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-primary text-primary-foreground"
            size="sm"
          >
            Sign In
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const user = session.user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  height={32}
                  width={32}
                  alt="Avatar"
                  className="rounded-full size-8"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name || "User"}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user?.image ? (
                  <Image
                    src={user.image}
                    height={32}
                    width={32}
                    alt="Avatar"
                    className="rounded-full size-8"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
