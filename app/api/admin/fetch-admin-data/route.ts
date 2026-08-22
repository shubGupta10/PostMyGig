import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getGigGrowth, getPingGrowth, getRoleDistribution, getUserGrowth } from "./analyticsService";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 403 })
        }

        if (session.user.isAdmin !== true) {
            return NextResponse.json({
                message: "Unauthorized access, you can access this route"
            }, { status: 403 })
        }

        const cacheKey = "admin_dashboard_data";

        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return NextResponse.json({
                    message: "Success (from cache)",
                    chartData: cachedData
                })
            }
        } catch (error) {
            console.warn("Redis cache read failed:", error);
        }

        await ConnectoDatabase();

        const thirtyDayAgo = new Date();
        thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const [userGrowth, gigGrowth, pingGrowth, roleDistribution] = await Promise.all([
            getUserGrowth(ninetyDaysAgo),
            getGigGrowth(thirtyDayAgo),
            getPingGrowth(thirtyDayAgo),
            getRoleDistribution()
        ])

        const chartData = {
            userGrowth,
            gigGrowth,
            pingGrowth,
            roleDistribution
        }

        try {
            await redis.set(cacheKey, JSON.stringify(chartData), { ex: 300 });
        } catch (error) {
            console.warn("Redis cache write failed:", error);
        }

        return NextResponse.json({
            message: "Success",
            chartData
        })
    } catch (error) {
        return NextResponse.json({
            message: "Server not working"
        }, { status: 500 })
    }
}