"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, User, LogOut, Shield, User2Icon, MessageCircleCodeIcon, MessageSquare } from "lucide-react"

interface UserDropdownProps {
  session: Session | null
}

export function UserDropdown({ session }: UserDropdownProps) {
  const { handleLogout } = useAuthStore()
  const router = useRouter()

  if (!session) {
    return (
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={() => router.push("/auth/login")}
          className="border-border text-primary hover:bg-accent hover:border-primary px-6 py-2 rounded-lg font-medium transition-all duration-200"
        >
          Sign In
        </Button>
      </div>
    )
  }

  const user = session.user
  const isAdmin = user?.role === "admin"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200 border border-transparent hover:border-border">
          {user?.image ? (
            <Image
              src={user.image || "/placeholder.svg"}
              height={36}
              width={36}
              alt="User Avatar"
              className="rounded-full border border-border"
            />
          ) : (
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm text-foreground font-medium max-w-32 truncate">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground max-w-32 truncate">{user?.email}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push(`/user/profile/${user?.id}`)} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push("/user-gigs")} className="cursor-pointer">
          <User2Icon className="mr-2 h-4 w-4" />
          Your Gigs
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/chat-history")} className="cursor-pointer">
          <MessageCircleCodeIcon className="mr-2 h-4 w-4" />
          Your Chats
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/user/feedback")} className="cursor-pointer">
          <MessageSquare className="mr-2 h-4 w-4" />
          Feedback
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/user/admin/dashboard")}>
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
