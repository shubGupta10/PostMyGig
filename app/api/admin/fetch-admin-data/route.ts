import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getGigGrowth, getPingGrowth, getRoleDistribution, getUserGrowth } from "./analyticsService";

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

        await ConnectoDatabase();

        const thirtyDayAgo = new Date();
        thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

        const [userGrowth, gigGrowth, pingGrowth, roleDistribution] = await Promise.all([
            getUserGrowth(thirtyDayAgo),
            getGigGrowth(thirtyDayAgo),
            getPingGrowth(thirtyDayAgo),
            getRoleDistribution()
        ])

        return NextResponse.json({
            message: "Success",
            chartData: {
                userGrowth,
                gigGrowth,
                pingGrowth,
                roleDistribution
            }
        })
    } catch (error) {
        return NextResponse.json({
            message: "Server not working"
        }, { status: 500 })
    }
}