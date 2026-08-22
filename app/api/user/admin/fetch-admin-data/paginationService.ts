import userModel from "@/modules/users/models/UserModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import FeedbackModel from "@/modules/admin/models/FeedbackModel";

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
