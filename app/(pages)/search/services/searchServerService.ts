import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import userModel from "@/modules/users/models/UserModel";
import { getServerSession } from "next-auth";

export async function fetchUsertoDisplay(page: number = 1, limit: number = 8) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return null;
        }

        await ConnectoDatabase();

        const targetRole = session.user.role === "client" ? "freelancer" : "client";

        const skip = (page - 1) * limit;

        const [userPipeline, totalCount] = await Promise.all([
            userModel.aggregate([
                {
                    $match: {
                        role: targetRole,
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
                role: targetRole
            })
        ])

        const pagination = {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        }

        const sanitizedUsers = JSON.parse(JSON.stringify(userPipeline));
        return {
            userPipeline: sanitizedUsers,
            pagination
        }
    } catch (error) {
        return null;
    }
}