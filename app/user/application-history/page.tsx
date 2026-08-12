import React from "react"
import { getDashboardDetails } from "@/app/dashboard/services/dashboardService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Briefcase, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { FreelancerDashboardData } from "@/app/dashboard/types"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Application History | PostMyGig",
  description: "View all your submitted project applications and their status",
}

export default async function ApplicationHistoryPage() {
  const { data, error } = await getDashboardDetails()

  if (error || !data) {
    redirect("/auth/login")
  }

  const freelancerData = data as FreelancerDashboardData
  const applications = (freelancerData.appliedHistory || []).sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime()
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-primary text-primary-foreground border-transparent"
      case "rejected":
        return "bg-destructive text-destructive-foreground border-transparent"
      default:
        return "bg-secondary text-secondary-foreground border-border"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {applications.length === 0 ? (
          <div className="border-2 border-dashed border-border bg-card p-6 sm:p-12 text-center rounded-2xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              No applications submitted yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6 sm:mb-8 leading-relaxed">
              Browse open gigs to start pitching your services to clients.
            </p>
            <Button
              asChild
              className="h-11 bg-primary text-primary-foreground font-semibold text-sm px-8 rounded-xl transition-colors shadow-xs"
            >
              <Link href="/view-gigs">Browse Open Gigs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((item) => (
              <div
                key={item._id}
                className="bg-card rounded-2xl border-2 border-border p-4 sm:p-5 shadow-xs hover:border-border/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {item.projectDetails?.title || "Gig Details"}
                    </h3>
                    <Badge className={`${getStatusBadge(item.status)} capitalize text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0`}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-normal">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      Applied {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.message && (
                      <span className="truncate hidden md:inline text-muted-foreground">
                        • "{item.message}"
                      </span>
                    )}
                  </div>
                </div>

                {item.status.toLowerCase() === "accepted" ? (
                  <Button
                    asChild
                    className="h-10 text-xs font-semibold px-5 rounded-xl shrink-0 shadow-xs bg-primary text-primary-foreground cursor-pointer"
                  >
                    <Link href={`/projects/${item.projectId}/huddle`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open Project Huddle
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="secondary"
                    className="h-10 text-xs font-semibold px-5 rounded-xl shrink-0 shadow-xs"
                  >
                    <Link href={`/open-gig/${item.projectId}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                )}


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
