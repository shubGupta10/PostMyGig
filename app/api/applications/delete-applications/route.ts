import { NextResponse, NextRequest, after } from "next/server";
import PingModel from "@/models/PingSchema";
import userModel from "@/models/UserModel";
import ProjectModel from "@/models/ProjectModel";
import { EmailSender } from "@/lib/email/send";
import { postMyGigPingRejectionTemplate } from "@/lib/email/templates";
import resend from "@/lib/resend";
import { dispatchNotification } from "@/lib/notification/dispatcher";


export async function DELETE(req: NextRequest) {
    try {
        const { applicationId } = await req.json();
        if (!applicationId) return NextResponse.json({ message: "Application ID is required" }, { status: 400 });

        const ping = await PingModel.findByIdAndUpdate(
            applicationId,
            { status: "rejected" },
            { new: true }
        );
        if (!ping) return NextResponse.json({ message: "Application not found" }, { status: 404 });

        const userEmail = ping.userEmail;
        const gigId = ping.projectId;

        const [userData, gigData] = await Promise.all([
            userModel.findOne({ email: userEmail }).lean(),
            ProjectModel.findById(gigId).lean()
        ]);


        after(async () => {
            const { error } = await resend.emails.send({
                from: 'PostMyGig <hello@postmygig.vercel.app>',
                to: userData?.email as string,
                subject: `Update on your ping for ${gigData?.title}`,
                html: postMyGigPingRejectionTemplate(userData?.name as string, gigData?.title as string)
            })

            if (error) {
                await EmailSender({
                    to: userData?.email as string,
                    subject: `Update on your ping for ${gigData?.title}`,
                    html: postMyGigPingRejectionTemplate(userData?.name as string, gigData?.title as string)
                })
            }

            if (userData?.email) {
                await dispatchNotification({
                    recipientEmail: userData.email,
                    type: "ping_rejected",
                    title: "Application Status Update",
                    message: `Your pitch for "${gigData?.title || 'Gig'}" was updated.`,
                    link: `/user/proposals`,
                })
            }
        })

        return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json({ message: "Error deleting application" }, { status: 500 });
    }
}