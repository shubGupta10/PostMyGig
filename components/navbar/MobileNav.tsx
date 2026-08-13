"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Session } from "next-auth"
import { Menu, X, LogOut, User, User2Icon, MessageCircleCodeIcon, MessageSquare, Shield, Briefcase, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/DarkModeToggle"
import { publicNavItems, authenticatedNavItems, adminNavItems } from "@/config/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileNavProps {
  session: Session | null
}

export function MobileNav({ session }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { handleLogout } = useAuthStore()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleNavigation = (path: string) => {
    closeMenu()
    router.push(path)
  }

  const handleMobileLogout = () => {
    closeMenu()
    handleLogout()
  }

  const isAdmin = session?.user?.role === "admin"

  return (
    <div className="flex items-center space-x-3 lg:hidden">
      <DarkModeToggle />
      
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center hover:bg-muted/50 p-1.5 rounded-lg transition-colors duration-200">
              {session.user?.image ? (
                <Image
                  src={session.user.image || "/placeholder.svg"}
                  height={32}
                  width={32}
                  alt="User Avatar"
                  className="rounded-full border border-border"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-medium">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{session.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation(`/user/profile/${session.user?.id}`)}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            {session.user?.role === "client" && (
              <DropdownMenuItem onClick={() => handleNavigation("/my-jobs")}>
                <Briefcase className="mr-2 h-4 w-4" />
                My Jobs
              </DropdownMenuItem>
            )}
            {session.user?.role === "freelancer" && (
              <DropdownMenuItem onClick={() => handleNavigation("/user/proposals")}>
                <FileText className="mr-2 h-4 w-4" />
                My Proposals
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleNavigation("/chat-history")}>
              <MessageCircleCodeIcon className="mr-2 h-4 w-4" />
              Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/user/feedback")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Feedback
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/user/admin/dashboard")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMobileLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-2 z-40">
          {publicNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-foreground hover:bg-muted transition-colors duration-200 text-left font-medium text-lg"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span>{item.title}</span>
            </button>
          ))}

          {session &&
            authenticatedNavItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-foreground hover:bg-muted transition-colors duration-200 text-left font-medium text-lg"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span>{item.title}</span>
              </button>
            ))}

          {session &&
            isAdmin &&
            adminNavItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-foreground hover:bg-muted transition-colors duration-200 text-left font-medium text-lg"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span>{item.title}</span>
              </button>
            ))}

          {!session && (
            <div className="pt-4 mt-2 border-t border-border">
              <Button
                onClick={() => handleNavigation("/auth/login")}
                className="w-full bg-primary text-primary-foreground font-semibold py-6 rounded-xl shadow-md"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
