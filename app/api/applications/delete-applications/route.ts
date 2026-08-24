import { NextResponse, NextRequest, after } from "next/server";
import PingModel from "@/modules/notifications/models/PingSchema";
import userModel from "@/modules/users/models/UserModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { EmailSender } from "@/lib/email/send";
import { postMyGigPingRejectionTemplate } from "@/lib/email/templates";
import resend from "@/lib/resend";
import { dispatchNotification } from "@/modules/notifications/services/dispatcher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";


export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unathorized"
            }, { status: 404 })
        }
        const { applicationId } = await req.json();
        if (!applicationId) return NextResponse.json({ message: "Application ID is required" }, { status: 400 });

        const ping = await PingModel.findById(applicationId);
        if (!ping) return NextResponse.json({ message: "Application not found" }, { status: 404 });

        const gigData = await ProjectModel.findById(ping.projectId).lean();
        if (!gigData) return NextResponse.json({ message: "Gig not found" }, { status: 404 });

        if (gigData.createdBy !== session.user.email) {
            return NextResponse.json({ message: "Forbidden. You do not own this gig." }, { status: 403 });
        }

        if (ping.status === 'accepted' || ping.status === 'contract_offered' || ping.status === 'in_progress') {
            return NextResponse.json({ 
                message: "This application is already accepted or in progress. Please use the Revoke Acceptance action instead." 
            }, { status: 400 });
        }

        ping.status = "rejected";
        await ping.save();
        const userEmail = ping.userEmail;
        const gigId = ping.projectId;

        const userData = await userModel.findOne({ email: userEmail }).lean();


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