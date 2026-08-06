"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Briefcase } from "lucide-react";
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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "accepted":
                return "bg-primary text-primary-foreground border-transparent";
            case "rejected":
                return "bg-destructive text-destructive-foreground border-transparent";
            default:
                return "bg-secondary text-secondary-foreground border-border";
        }
    };

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

            {/* Application History */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">Application History</h2>
                        <p className="text-sm text-muted-foreground font-normal mt-1">Pitches and proposals submitted to open gigs</p>
                    </div>
                </div>

                {(!data.appliedHistory || data.appliedHistory.length === 0) ? (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {data.appliedHistory.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col h-full border-2 border-border bg-card shadow-xs rounded-2xl overflow-hidden p-5 sm:p-6 space-y-4 justify-between"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 leading-tight">
                                            {item.projectDetails?.title || "Gig Details"}
                                        </h3>
                                        <Badge className={`${getStatusColor(item.status)} capitalize text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full shrink-0`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    {item.message && (
                                        <p className="text-xs sm:text-sm font-normal text-muted-foreground line-clamp-2 leading-relaxed">
                                            "{item.message}"
                                        </p>
                                    )}
                                    <p className="text-xs font-normal text-muted-foreground">
                                        Applied on {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-border mt-auto">
                                    <Button
                                        variant="secondary"
                                        onClick={() => router.push(`/open-gig/${item.projectId}`)}
                                        className="w-full justify-center h-10 font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


