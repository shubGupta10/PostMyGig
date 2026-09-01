"use client"

import { LogOut, ChevronsUpDown } from "lucide-react"
import { Session } from "next-auth"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/modules/users/store/useAuthStore"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RoleSwitcher } from "@/modules/users/components/RoleSwitcher"

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
  const { theme, setTheme } = useTheme()

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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-auto p-2"
              asChild
            >
              <div role="button" tabIndex={0} className="w-full flex items-start gap-2 cursor-pointer">
                {user?.image ? (
                  <Image
                    src={user.image}
                    height={32}
                    width={32}
                    alt="Avatar"
                    className="rounded-full size-8 shrink-0"
                  />
                ) : (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col flex-1 gap-1 overflow-hidden">
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate font-semibold text-sm leading-none">{user?.name || "User"}</span>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
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

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="cursor-pointer"
            >
              <Moon className="mr-2 size-4 hidden dark:block" />
              <Sun className="mr-2 size-4 dark:hidden block" />
              Toggle Theme
            </DropdownMenuItem>

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
