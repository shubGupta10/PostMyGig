"use client";

import type { ClientDashboardData } from "@/app/dashboard/types";
import { DashboardProjects } from "./DashboardProjects";
import { UsageMeter } from "@/components/subscription/UsageMeter";

export function ClientDashboard({ data }: { data: ClientDashboardData }) {
    const stats = [
        {
            title: "Total Gigs Posted",
            value: data.totalProjects,
        },
        {
            title: "Active Gigs",
            value: data.activeProjects,
        },
        {
            title: "Applications Received",
            value: data.totalApplicationsReceived,
        },
    ];

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
                <UsageMeter stats={data.usageStats} label="Gigs" />
            )}

            {/* My Posted Gigs */}
            <DashboardProjects projects={data.projects as any} />
        </div>
    );
}


