import { ConnectoDatabase } from "@/lib/db";
import { FetchDashboardResult } from "../types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import { after } from "next/server";

export async function getDashboardDetails(): Promise<FetchDashboardResult> {
    try {
        await ConnectoDatabase();
        const session = await getServerSession(authOptions);
        if (!session?.user.id || !session.user.email) {
            return {
                data: null,
                rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
                error: "Unauthorized"
            }
        }

        const userEmail = session.user.email;
        const cacheKey = `dashboard-data:${userEmail}`;

        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                const parsedData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
                return {
                    data: parsedData,
                    rateLimitInfo: {
                        isLimited: false,
                        retryAfter: null,
                        message: "",
                        timestamp: 0
                    },
                    error: null,
                }
            }
        } catch (error) {
            console.warn("Failed to parse cached data, fetching fresh:", error);
        }

        const allprojects = await ProjectModel.find({ createdBy: userEmail }).lean();
        const totalPings = await PingModel.countDocuments({ userEmail });

        const sanitizedProjects = allprojects.map(project => ({
            ...project,
            _id: project._id.toString(),
        }));

        const dashboardData = {
            totalProjects: sanitizedProjects.length,
            totalPings,
            projects: sanitizedProjects
        };

        after(async () => {
            try {
                await redis.set(cacheKey, JSON.stringify(dashboardData), { ex: 600 });
            } catch (error) {
                console.warn("Failed to cache data:", error);
            }
        })

        return {
            data: dashboardData as any,
            rateLimitInfo: {
                isLimited: false,
                retryAfter: null,
                message: "",
                timestamp: 0
            },
            error: null
        }

    } catch (error) {
        console.error("Error in dashboard service:", error);
        return {
            data: null,
            rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
            error: "Internal Server Error",
        };
    }
}