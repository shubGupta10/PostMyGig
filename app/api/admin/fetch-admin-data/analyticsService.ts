import ProjectModel from "@/modules/gigs/models/ProjectModel";
import PingModel from "@/modules/notifications/models/PingSchema";
import userModel from "@/modules/users/models/UserModel";

export async function getUserGrowth(ninetyDaysAgo: Date) {
    const dateString = ninetyDaysAgo.toISOString();

    return await userModel.aggregate([
        {
            $match: { createdAt: { $gte: dateString } }
        },
        {
            $group: {
                _id: { $substr: ["$createdAt", 0, 10] },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
}

export async function getGigGrowth(thirtyDaysAgo: Date) {
    return await ProjectModel.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
}

export async function getPingGrowth(thirtyDaysAgo: Date) {
    return await PingModel.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
}

export async function getRoleDistribution() {
    return await userModel.aggregate([
        {
            $group: {
                _id: "$role",
                count: {
                    $sum: 1
                }
            }
        }
    ])
}