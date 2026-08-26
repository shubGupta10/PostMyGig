import React from "react"
import { getDashboardDetails } from "@/app/(pages)/dashboard/services/dashboardService"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import type { FreelancerDashboardData } from "@/app/(pages)/dashboard/types"
import { redirect } from "next/navigation"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { formatActivityDate, groupItemsByTimeline } from "@/lib/helpers"
import { ProposalCard } from "@/modules/gigs/components/ProposalCard"

export const metadata = {
  title: "My Proposals | PostMyGig",
  description: "View all your submitted project applications and their status",
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ApplicationHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const { data, error } = await getDashboardDetails(currentPage, 6);

  if (error || !data) {
    redirect("/auth/login")
  }

  const freelancerData = data as FreelancerDashboardData
  const applications = freelancerData.appliedHistory || []
  const pagination = freelancerData.pagination

  const groupedApplications = groupItemsByTimeline(
    applications,
    (app) => (app as any).updatedAt || app.createdAt
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10 w-full min-w-0 max-w-full">
      <div className="max-w-7xl mx-auto space-y-6 w-full min-w-0">

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
          <div className="space-y-8">
            {groupedApplications.map((group) => (
              <div key={group.label} className="space-y-3">
                {/* Timeline Section Header */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => {
                    const isUpdated = Boolean(
                      (item as any).updatedAt &&
                      new Date((item as any).updatedAt).getTime() - new Date(item.createdAt).getTime() > 60000
                    );
                    const activityText = isUpdated
                      ? formatActivityDate((item as any).updatedAt, "Updated")
                      : formatActivityDate(item.createdAt, "Applied");

                    const isProjectCompleted = item.projectDetails?.status?.toLowerCase() === "completed";
                    const displayStatus = (isProjectCompleted && ["in_progress", "accepted"].includes(item.status.toLowerCase()))
                      ? "completed"
                      : item.status;

                    return (
                      <ProposalCard
                        key={item._id}
                        item={item as any}
                        displayStatus={displayStatus}
                        activityText={activityText}
                      />
                    )
                  })}
                </div>
              </div>
            ))}

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={pagination.hasPrevPage ? `?page=${pagination.page - 1}` : undefined}
                        className={!pagination.hasPrevPage ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={`?page=${pageNum}`}
                          isActive={pageNum === pagination.page}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={pagination.hasNextPage ? `?page=${pagination.page + 1}` : undefined}
                        className={!pagination.hasNextPage ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
