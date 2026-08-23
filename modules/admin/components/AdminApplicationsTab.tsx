import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdminApplicationFeed } from "./types"
import { ExternalLink, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminApplicationsTabProps {
  applications: AdminApplicationFeed[]
  pagination?: {
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  onPageChange?: (page: number) => void
}

export function AdminApplicationsTab({ applications, pagination, onPageChange }: AdminApplicationsTabProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Global Applications Feed</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Real-time stream of all project applications across the platform</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[150px]">Applicant</TableHead>
                <TableHead className="min-w-[200px]">Project</TableHead>
                <TableHead className="min-w-[150px]">Message / Link</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{app.applicantName}</span>
                        <span className="text-xs text-muted-foreground">{app.applicantEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => router.push(`/open-gig/${app.projectId}`)} className="text-sm font-medium line-clamp-2 cursor-pointer">{app.projectTitle}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {app.message && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="flex items-start text-xs text-muted-foreground max-w-[200px] cursor-pointer hover:text-foreground transition-colors group">
                                <MessageSquare className="w-3 h-3 mr-1 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                                <span className="line-clamp-2" title="Click to read full message">{app.message}</span>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Application Message</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 p-4 rounded-md bg-muted/50 text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                                {app.message}
                              </div>
                              <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                                <span>From: {app.applicantName}</span>
                                <span>{formatDate(app.createdAt)}</span>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {app.bestWorkLink && (
                          <a
                            href={app.bestWorkLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center text-xs text-blue-500 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Work
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.hasPrevPage && onPageChange) {
                        onPageChange(pagination.page - 1)
                      }
                    }}
                    className={!pagination.hasPrevPage ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (onPageChange) {
                          onPageChange(pageNum)
                        }
                      }}
                      isActive={pageNum === pagination.page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.hasNextPage && onPageChange) {
                        onPageChange(pagination.page + 1)
                      }
                    }}
                    className={!pagination.hasNextPage ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
