import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import redis from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";

const uploadRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "rate-limit:chat_Upload"
})

const f = createUploadthing();

export const ourFileRouter = {
    chatAttachment: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 1
        },
        pdf: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            const session = await getServerSession(authOptions);
            if (!session?.user?.id) {
                throw new Error("Unauthorized");
            }

            const { success, reset } = await uploadRateLimiter.limit(session.user.id);
            if (!success) {
                const minLeft = Math.ceil((reset - Date.now()) / (1000 * 60));
                throw new Error(`Upload limit reached (10 files/hour). Please try again in ${minLeft}m.`);
            }
            return {
                userId: session.user.id
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return {
                uploadedBy: metadata.userId,
                url: file.ufsUrl || file.url,
                fileName: file.name,
                fileSize: file.size,
                fileKey: file.key,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter