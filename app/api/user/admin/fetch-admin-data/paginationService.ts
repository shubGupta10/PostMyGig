import userModel from "@/modules/users/models/UserModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import FeedbackModel from "@/modules/admin/models/FeedbackModel";
import PingModel from "@/modules/notifications/models/PingSchema";

export async function getPaginatedUsers(page: number, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
        userModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        userModel.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return {
        data,
        pagination: {
            page,
            totalPages: totalPages === 0 ? 1 : totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
}

export async function getPaginatedProjects(page: number, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
        ProjectModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        ProjectModel.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return {
        data,
        pagination: {
            page,
            totalPages: totalPages === 0 ? 1 : totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
}

export async function getPaginatedFeedbacks(page: number, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
        FeedbackModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        FeedbackModel.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return {
        data,
        pagination: {
            page,
            totalPages: totalPages === 0 ? 1 : totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
}

export async function getPaginatedApplications(page: number, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
        PingModel.aggregate([
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $addFields: {
                    projectId: { $toObjectId: "$projectId" }
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "projectDetails"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userEmail",
                    foreignField: "email",
                    as: "userData"
                }
            },
            {
                $unwind: {
                    path: "$projectDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    projectId: 1,
                    isCurated: "$projectDetails.isCurated",
                    status: 1,
                    createdAt: 1,
                    message: 1,
                    bestWorkLink: 1,
                    projectTitle: "$projectDetails.title",
                    applicantName: "$userData.name",
                    applicantEmail: "$userEmail"
                }
            }
        ]),
        PingModel.countDocuments()
    ])

    const totalPages = Math.ceil(totalCount / limit);
    return {
        data,
        pagination: {
            page,
            totalPages: totalPages === 0 ? 1 : totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    }
}