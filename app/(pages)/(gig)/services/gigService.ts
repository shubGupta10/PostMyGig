import { ConnectoDatabase } from "@/lib/db";
import { FetchGigsResult } from "../types";
import redis from "@/lib/redis";
import ProjectModel from "@/models/ProjectModel";
import { after } from "next/server";

export async function getGigs(page = 1, limit = 9, search = "", skill = "", sort = "newest"): Promise<FetchGigsResult> {
    try {
        await ConnectoDatabase();

        const skip = (page - 1) * limit;
        const cachekey = `fetch-gigs:page:${page}:${limit}:${search}:${skill}:${sort}`;

        try {
            const cachedGigs = await redis.get(cachekey);
            if (cachedGigs) {
                const parsedData = typeof cachedGigs === "string" ? JSON.parse(cachedGigs) : cachedGigs;

                return {
                    gigs: parsedData.gigs,
                    pagination: parsedData.pagination,
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
            console.warn("Redis cache read failed:", error);
        }

        const currentDate = new Date();
        const query: Record<string, any> = {
            expiresAt: { $gt: currentDate },
            status: { $nin: ["accepted", "completed", "expired"] }
        };

        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { title: { $regex: safeSearch, $options: "i" } },
                { description: { $regex: safeSearch, $options: "i" } },
                { skillsRequired: { $regex: safeSearch, $options: "i" } }
            ]
        }
        if (skill) {
            const safeSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.skillsRequired = { $regex: safeSkill, $options: "i" };
        }

        const [gigs, totalCount] = await Promise.all([
            ProjectModel.find(query)
                .select("title description skillsRequired status createdAt expiresAt createdBy isFlagged reportCount")
                .sort({ createdAt: sort === "oldest" ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ProjectModel.countDocuments(query)
        ]);

        const sanitizedGigs = gigs.map(gig => ({
            ...gig,
            _id: gig._id.toString()
        }));

        const totalPages = Math.ceil(totalCount / limit);
        const pagination = {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };

        const datatoCache = { gigs: sanitizedGigs, pagination };

        after(async () => {
            try {
                await redis.sadd("gig-cache-keys-for-deletion", cachekey);
                await redis.set(cachekey, JSON.stringify(datatoCache), { ex: 300 });
            } catch (error) {
                console.error("Failed to update cache:", error);
            }
        })

        return {
            gigs: sanitizedGigs as any,
            pagination,
            rateLimitInfo: {
                isLimited: false,
                retryAfter: null,
                message: "",
                timestamp: 0
            },
            error: null
        }
    } catch (error) {
        console.error("Error fetching gigs service:", error);
        return {
            gigs: [],
            pagination: { page, limit, totalCount: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
            rateLimitInfo: { isLimited: false, retryAfter: null, message: "", timestamp: 0 },
            error: "Internal Server Error",
        };
    }
}