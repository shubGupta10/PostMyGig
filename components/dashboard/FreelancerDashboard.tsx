"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Briefcase, Calendar, ArrowRight } from "lucide-react";
import type { FreelancerDashboardData } from "@/app/dashboard/types";
import { UsageMeter } from "@/components/subscription/UsageMeter";

export function FreelancerDashboard({ data }: { data: FreelancerDashboardData }) {
    const router = useRouter();

    const stats = [
        {
            title: "Total Pings Sent",
            value: data.totalPingsSent,
        },
        {
            title: "Accepted Pitches",
            value: data.acceptedPingsCount,
        },
        {
            title: "Pending Responses",
            value: data.pendingPingsCount,
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "accepted":
                return "bg-primary text-primary-foreground border-transparent";
            case "rejected":
                return "bg-destructive text-destructive-foreground border-transparent";
            default:
                return "bg-secondary text-secondary-foreground border-border";
        }
    };

    const recentApplications = (data.appliedHistory || []).slice(0, 5);

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-background rounded-2xl border-2 border-border shadow-xs p-5 sm:p-6 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quota Usage Meter */}
            {data.usageStats && (
                <UsageMeter stats={data.usageStats} label="Pings" />
            )}

            {/* Application History Section */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">Application History</h2>
                    </div>
                    {data.appliedHistory && data.appliedHistory.length > 5 && (
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/user/application-history")}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground p-0 h-auto cursor-pointer"
                        >
                            View All History ({data.appliedHistory.length})
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                    )}
                </div>

                {recentApplications.length === 0 ? (
                    <div className="border-2 border-dashed border-border bg-card p-6 sm:p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
                            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No applications submitted yet</h3>
                        <p className="text-sm text-muted-foreground font-normal max-w-sm mb-6 sm:mb-8 leading-relaxed">
                            Browse open gigs to start pitching your services to clients.
                        </p>
                        <Button
                            onClick={() => router.push("/view-gigs")}
                            className="h-11 bg-primary text-primary-foreground font-semibold text-sm px-8 rounded-xl transition-colors shadow-xs cursor-pointer"
                        >
                            Browse Open Gigs
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentApplications.map((item) => (
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

                                <Button
                                    variant="secondary"
                                    onClick={() => router.push(`/open-gig/${item.projectId}`)}
                                    className="h-10 text-xs font-semibold px-5 rounded-xl shrink-0 cursor-pointer shadow-xs"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
