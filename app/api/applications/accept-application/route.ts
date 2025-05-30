import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import { postMyGigApplicationAcceptedTemplate } from "@/lib/email/templates";
import userModel from "@/models/UserModel";

//accept application
export async function POST(req: NextRequest){
    try {
        await ConnectoDatabase();
        const {applicationId, gigId, applicantEmail} = await req.json();
        if (!applicationId || !gigId || !applicantEmail) {
            return NextResponse.json({ error: "Application ID, Gig ID, and Applicant Email are required" }, { status: 400 });
        }

        // Find the application by ID
        const application = await PingModel.findById(applicationId);
        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Update the application status to "accepted"
        application.status = "accepted";
        await application.save();

        //update freelancer email in ProjectModel
        await ProjectModel.findByIdAndUpdate(gigId, {
            AcceptedFreelancerEmail: applicantEmail
        }, { new: true });

        //change the status of project in project model
        await ProjectModel.findByIdAndUpdate(gigId, {
            status: "completed"
        }, { new: true });

        //find freelancerName
        const freelancerWeSearchingFor = await userModel.findOne({email: applicantEmail});
        if (!freelancerWeSearchingFor) {
            return NextResponse.json({ error: "Freelancer not found" }, { status: 404 });
        }
        //fetch gigTitle
        const fetchGigTitle = await ProjectModel.findById(gigId);

        //send mail for application accepted
        await EmailSender({
            to: applicantEmail,
            subject: "You Application got selected",
            html: postMyGigApplicationAcceptedTemplate(
                freelancerWeSearchingFor.name,
                fetchGigTitle?.title as string,
            )
        })

        return NextResponse.json({
            message: "Application accepted successfully",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}