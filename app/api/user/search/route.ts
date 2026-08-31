import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import userModel from "@/modules/users/models/UserModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized, Session not found"
            }, { status: 401 })
        }

        await ConnectoDatabase();

        const targetRole = session.user.role === "freelancer" ? "client" : "freelancer"

        const q = req.nextUrl.searchParams.get("q");

        const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [userPipeline, totalCount] = await Promise.all([
            userModel.aggregate([
                {
                    $match: {
                        role: targetRole,
                        ...(q && {
                            $or: [
                                { name: { $regex: q, $options: "i" } },
                                { skills: { $regex: q, $options: "i" } },
                                { bio: { $regex: q, $options: "i" } }
                            ]
                        })
                    }
                },
                {
                    $sort: {
                        averageRating: -1,
                        totalReviews: -1,
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        password: 0,
                        email: 0,
                        balance: 0
                    }
                }
            ]),
            userModel.countDocuments({
                role: targetRole,
                ...(q && {
                    $or: [
                        { name: { $regex: q, $options: "i" } },
                        { skills: { $regex: q, $options: "i" } },
                        { bio: { $regex: q, $options: "i" } }
                    ]
                })
            }),
        ])

        return NextResponse.json({
            userPipeline,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        }, { status: 200 })
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}