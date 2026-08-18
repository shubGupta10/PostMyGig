import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminHeaderProps {
  userName?: string | null
  userImage?: string | null
}

export function AdminHeader({ userName, userImage }: AdminHeaderProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Welcome back, {userName || "Admin"}
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-border">
              <AvatarImage src={userImage || ""} />
              <AvatarFallback className="font-semibold text-primary bg-primary/10">
                {userName?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
