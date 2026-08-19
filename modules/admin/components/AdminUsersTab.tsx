"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, MapPin, Calendar, Mail } from "lucide-react"
import { UserType } from "./types"

interface AdminUsersTabProps {
  users: UserType[]
  onToggleVerify: (userId: string, currentStatus: boolean) => void
}

export function AdminUsersTab({ users, onToggleVerify }: AdminUsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "freelancer":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg">User Management</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage and monitor all registered users</CardDescription>
          </div>
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64 h-10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">User</TableHead>
                <TableHead className="min-w-[100px]">Role</TableHead>
                <TableHead className="min-w-[120px]">Location</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.profilePhoto || ""} />
                          <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-sm truncate flex items-center gap-1.5">
                            {user.name}
                            {user.isVerified && (
                              <span className="text-blue-500 text-xs">✓</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate flex items-center">
                            <Mail className="h-3 w-3 mr-1 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">{user.location || "Not specified"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.skills?.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-[10px]">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills && user.skills.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{user.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                        <Calendar className="h-3 w-3 mr-1 shrink-0" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.isBanned ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"
                        }
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/user/profile/${user._id}`} target="_blank">
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleVerify(user._id, user.isVerified || false)}>
                            {user.isVerified ? "Revoke Verification" : "Verify User"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
