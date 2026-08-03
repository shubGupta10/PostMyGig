import { NextResponse, NextRequest, after } from "next/server";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import { postMyGigApplicationAcceptedTemplate } from "@/lib/email/templates";
import userModel from "@/models/UserModel";
import resend from "@/lib/resend";
import redis from "@/lib/redis";

//accept application
export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { applicationId, gigId, applicantEmail } = await req.json();
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

        //delete the rest freelancers pings upon selecting one application 
        const resultDelete = await PingModel.deleteMany({
            userEmail: { $ne: applicantEmail }, // delete pings where userEmail is NOT the selected freelancer's email
            projectId: gigId
        });
        console.log("Email", applicantEmail);
        console.log("Gig", gigId);

        console.log("Here is result delete", resultDelete);


        //update freelancer email in ProjectModel
        await ProjectModel.findByIdAndUpdate(gigId, {
            AcceptedFreelancerEmail: applicantEmail
        }, { new: true });

        //change the status of project in project model
        await ProjectModel.findByIdAndUpdate(gigId, {
            status: "completed"
        }, { new: true });

        // Invalidate gig caches since its status changed
        try {
            await redis.del(`fetch-open-gig:${gigId}`);
            const keys = await redis.keys("fetch-gigs:*");
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } catch (e) {
            console.warn("Failed to invalidate cache", e);
        }


        // Run both unrelated database queries at the exact same time
        const [freelancerWeSearchingFor, fetchGigTitle] = await Promise.all([
            userModel.findOne({ email: applicantEmail }).lean(),
            ProjectModel.findById(gigId).lean()
        ]);

        if (!freelancerWeSearchingFor) {
            return NextResponse.json({ error: "Freelancer not found" }, { status: 404 });
        }

        after(async () => {
            const { error } = await resend.emails.send({
                from: 'PostMyGig <hello@postmygig.vercel.app>',
                to: applicantEmail,
                subject: "You Application Got Selected",
                html: postMyGigApplicationAcceptedTemplate(
                    freelancerWeSearchingFor.name,
                    fetchGigTitle?.title as string,
                )
            })

            if (error) {
                await EmailSender({
                    to: applicantEmail,
                    subject: "You Application got selected",
                    html: postMyGigApplicationAcceptedTemplate(
                        freelancerWeSearchingFor.name,
                        fetchGigTitle?.title as string,
                    )
                })
            }
        })


        return NextResponse.json({
            message: "Application accepted successfully",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}