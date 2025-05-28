import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";
import userModel from "@/models/UserModel";
import ProjectModel from "@/models/ProjectModel";
import { EmailSender } from "@/lib/email/send";
import { postMyGigPingRejectionTemplate } from "@/lib/email/templates";


export async function DELETE(req: NextRequest){
    try {
        const {applicationId} = await req.json();
        if(!applicationId) return NextResponse.json({message: "Application ID is required"}, {status: 400});

        const ping = await PingModel.findByIdAndDelete(applicationId);
        if(!ping) return NextResponse.json({message: "Application not found"}, {status: 404});

        const userEmail = ping.userEmail;
        const gigId = ping.projectId;

        //find userdata and gigData
        const userData = await userModel.findOne({email: userEmail});
        const gigData = await ProjectModel.findById(gigId);


        //send mail to the applier
        await EmailSender({
            to: userData?.email as string,
            subject: `Update on your ping for ${gigData?.title}`,
            html: postMyGigPingRejectionTemplate(userData?.name as string, gigData?.title as string)
        })

        return NextResponse.json({message: "Application deleted successfully"}, {status: 200});
    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json({message: "Error deleting application"}, {status: 500});
    }
}