import { NextResponse, NextRequest, after } from "next/server";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import { postMyGigApplicationAcceptedTemplate } from "@/lib/email/templates";
import userModel from "@/models/UserModel";
import resend from "@/lib/resend";
import redis from "@/lib/redis";
import { dispatchNotification } from "@/lib/notification/dispatcher";
import Activity from "@/models/ActivityModel";

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

        //reject the rest freelancers pings upon selecting one application 
        await PingModel.updateMany(
            {
                userEmail: { $ne: applicantEmail },
                projectId: gigId
            },
            {
                $set: { status: "rejected" }
            }
        );

        //update freelancer email in ProjectModel
        await ProjectModel.findByIdAndUpdate(gigId, {
            AcceptedFreelancerEmail: applicantEmail
        }, { new: true });

        //change the status of project in project model
        await ProjectModel.findByIdAndUpdate(gigId, {
            status: "assigned"
        }, { new: true });

        // Fetch all applicants for this gig to invalidate their proposal/dashboard caches
        const allApplicationsForGig = await PingModel.find({ projectId: gigId }).select("userEmail").lean();

        // Invalidate gig and dashboard caches
        try {
            const keysToDelete: string[] = [
                `open-gig:${gigId}`,
                `fetch-open-gig:${gigId}`,
            ];

            // Invalidate client dashboard & project list cache (all pages)
            if (application.posterEmail) {
                const clientKeys = await redis.keys(`dashboard-data:client:${application.posterEmail}*`);
                const projectKeys = await redis.keys(`user-projects:${application.posterEmail}*`);
                keysToDelete.push(...clientKeys, ...projectKeys);
            }

            // Invalidate freelancer dashboard cache for all applicants (accepted and rejected)
            for (const app of allApplicationsForGig) {
                if (app.userEmail) {
                    const fKeys = await redis.keys(`dashboard-data:freelancer:${app.userEmail}*`);
                    keysToDelete.push(...fKeys);
                }
            }

            // Invalidate global gig lists
            const gigKeys = await redis.keys("fetch-gigs:*");
            keysToDelete.push(...gigKeys);

            if (keysToDelete.length > 0) {
                const uniqueKeys = Array.from(new Set(keysToDelete));
                await redis.del(...uniqueKeys);
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

            // Dispatch in-app notification to freelancer
            await dispatchNotification({
                recipientEmail: applicantEmail,
                type: "ping_accepted",
                title: "Application Accepted!",
                message: `Your pitch for "${fetchGigTitle?.title || 'Gig'}" was accepted by the client.`,
                link: `/projects/${gigId}/huddle`,
            });

            // Record public activity
            try {
                const poster = await userModel.findOne({ email: application.posterEmail }).select("name").lean();
                await Activity.create({
                    userId: freelancerWeSearchingFor._id.toString(),
                    gigId: gigId,
                    type: 'hired',
                    metadata: {
                        clientName: poster?.name || "Client",
                        freelancerName: freelancerWeSearchingFor.name || "Freelancer",
                        gigTitle: fetchGigTitle?.title || "Gig",
                        skills: fetchGigTitle?.skillsRequired?.slice(0, 3) || [],
                        budget: fetchGigTitle?.budget || "",
                    }
                });
                await redis.del("real-time-activity-data");
                await redis.del("public-success-feed");
            } catch (actErr) {
                console.warn("Failed to record hired activity:", actErr);
            }
        })


        return NextResponse.json({
            message: "Application accepted successfully",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}