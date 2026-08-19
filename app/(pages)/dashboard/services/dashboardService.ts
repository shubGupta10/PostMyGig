import { ConnectoDatabase } from "@/lib/db";
import { FetchDashboardResult, ClientDashboardData, FreelancerDashboardData } from "../types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import PingModel from "@/modules/notifications/models/PingSchema";
import { getUserUsageStats } from "@/modules/subscriptions/services/engine";
import { ACTION_TYPES } from "@/modules/subscriptions/services/config/subscriptions";
import { after } from "next/server";

export async function getDashboardDetails(page: number = 1, limit: number = 6): Promise<FetchDashboardResult> {
    try {
        await ConnectoDatabase();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || !session?.user?.email) {
            return {
                data: null,
                rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
                error: "Unauthorized",
            };
        }

        const userEmail = session.user.email;
        const skip = (page - 1) * limit;
        const userRole = session.user.role || "freelancer";
        const cacheKey = `dashboard-data:${userRole}:${userEmail}:page:${page}:${limit}`;

        // 1. Try Redis Cache
        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                const parsedData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
                return {
                    data: parsedData,
                    rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
                    error: null,
                };
            }
        } catch (error) {
            console.warn("Failed to parse cached dashboard data, fetching fresh:", error);
        }

        let dashboardData: ClientDashboardData | FreelancerDashboardData;

        // 2. Client Dashboard Flow
        if (userRole === "client") {
            const [allProjects, totalApplicationsReceived] = await Promise.all([
                ProjectModel.find({ createdBy: userEmail }).sort({ createdAt: -1 }).lean(),
                PingModel.countDocuments({ posterEmail: userEmail }),
            ]);

            const sanitizedProjects = allProjects.map((project: any) => ({
                ...project,
                _id: project._id.toString(),
            }));

            const activeProjects = sanitizedProjects.filter(
                (p: any) => p.status?.toLowerCase() === "active"
            ).length;

            const expiredProjects = sanitizedProjects.filter(
                (p: any) => p.status?.toLowerCase() === "expired"
            ).length;

            const usageStats = await getUserUsageStats(
                session.user.id,
                userEmail,
                "client",
                ACTION_TYPES.POST_GIG
            );

            dashboardData = {
                role: "client",
                totalProjects: sanitizedProjects.length,
                activeProjects,
                expiredProjects,
                totalApplicationsReceived,
                projects: sanitizedProjects as any,
                usageStats,
            };
        }
        // 3. Freelancer Dashboard Flow
        else {
            const [pingStatusCounts, appliedHistory] = await Promise.all([
                // Group status counts in 1 DB query
                PingModel.aggregate([
                    { $match: { userEmail } },
                    { $group: { _id: "$status", count: { $sum: 1 } } },
                ]),
                // Fetch pings joined with project details using $lookup aggregation
                PingModel.aggregate([
                    { $match: { userEmail } },
                    { $sort: { updatedAt: -1, createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $addFields: {
                            projectObjectId: { $toObjectId: "$projectId" }
                        }
                    },
                    {
                        $lookup: {
                            from: "projects",
                            localField: "projectObjectId",
                            foreignField: "_id",
                            as: "projectDetails"
                        }
                    },
                    { $unwind: { path: "$projectDetails", preserveNullAndEmptyArrays: true } }
                ])
            ]);

            // Parse Aggregation Results
            let totalPingsSent = 0;
            let acceptedPingsCount = 0;
            let pendingPingsCount = 0;
            let rejectedPingsCount = 0;

            pingStatusCounts.forEach((group: { _id: string; count: number }) => {
                totalPingsSent += group.count;
                if (group._id === "accepted") acceptedPingsCount = group.count;
                if (group._id === "pending") pendingPingsCount = group.count;
                if (group._id === "rejected") rejectedPingsCount = group.count;
            });

            const totalPages = Math.ceil(totalPingsSent / limit);
            const pagination = {
                page,
                limit,
                totalCount: totalPingsSent,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            }

            const usageStats = await getUserUsageStats(
                session.user.id,
                userEmail,
                "freelancer",
                ACTION_TYPES.SEND_PING
            );

            dashboardData = {
                role: "freelancer",
                totalPingsSent,
                acceptedPingsCount,
                pendingPingsCount,
                rejectedPingsCount,
                appliedHistory: appliedHistory.map((p: any) => ({
                    _id: p._id.toString(),
                    projectId: p.projectId ? p.projectId.toString() : "",
                    userEmail: p.userEmail,
                    posterEmail: p.posterEmail,
                    message: p.message || "",
                    status: p.status || "pending",
                    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
                    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
                    projectDetails: p.projectDetails
                        ? {
                            title: p.projectDetails.title,
                            category: p.projectDetails.category,
                            budget: p.projectDetails.budget,
                        }
                        : undefined,
                })),
                pagination,
                usageStats,
            };
        }

        // Cache the role-based data in Redis for 10 minutes
        after(async () => {
            try {
                await redis.set(cacheKey, JSON.stringify(dashboardData), { ex: 600 });
            } catch (error) {
                console.warn("Failed to cache dashboard data:", error);
            }
        });

        return {
            data: dashboardData,
            rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
            error: null,
        };
    } catch (error) {
        console.error("Error in dashboard service:", error);
        return {
            data: null,
            rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
            error: "Internal Server Error",
        };
    }
}
