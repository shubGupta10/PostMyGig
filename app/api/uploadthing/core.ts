import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"

const f = createUploadthing();

export const ourFileRouter = {
    chatAttachment: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        },
        pdf: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            const session = await getServerSession(authOptions);
            if (!session?.user?.id) {
                throw new Error("Unauthorized");
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