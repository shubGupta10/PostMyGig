import { NextResponse, NextRequest, after } from "next/server";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import { postMyGigApplicationAcceptedTemplate } from "@/lib/email/templates";
import userModel from "@/modules/users/models/UserModel";
import resend from "@/lib/resend";
import redis from "@/lib/redis";
import { dispatchNotification } from "@/modules/notifications/services/dispatcher";
import Activity from "@/modules/notifications/models/ActivityModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    let dbSession;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 404 })
        }

        await ConnectoDatabase();
        const { applicationId, gigId, applicantEmail } = await req.json();

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        //find the gig in db
        const project = await ProjectModel.findById(gigId).session(dbSession);
        if (!project) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({ error: "Gig not found" }, { status: 404 });
        }

        if (project.createdBy !== session.user.email) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({
                message: "Forbidden. You are not allowed to accept applications for someone else's gig."
            }, { status: 403 })
        }

        if (project.status !== 'active') {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({
                error: "This gig is already assigned or no longer active. You must revoke the current acceptance first."
            }, { status: 400 });
        }
        if (!applicationId || !gigId || !applicantEmail) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({ error: "Application ID, Gig ID, and Applicant Email are required" }, { status: 400 });
        }

        const application = await PingModel.findById(applicationId).session(dbSession);
        if (!application) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Update the application status to "accepted"
        application.status = "accepted";
        await application.save({ session: dbSession });

        //reject the rest freelancers pings upon selecting one application 
        await PingModel.updateMany(
            {
                userEmail: { $ne: applicantEmail },
                projectId: gigId
            },
            {
                $set: { status: "rejected" }
            },
            { session: dbSession }
        );

        //update freelancer email in ProjectModel
        await ProjectModel.findByIdAndUpdate(gigId, {
            AcceptedFreelancerEmail: applicantEmail
        }, { new: true, session: dbSession });

        //change the status of project in project model
        await ProjectModel.findByIdAndUpdate(gigId, {
            status: "accepted"
        }, { new: true, session: dbSession });

        await dbSession.commitTransaction();
        await dbSession.endSession();

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
        console.error("Error accepting application:", error);
        if (dbSession) {
            try {
                await dbSession.abortTransaction();
                await dbSession.endSession();
            } catch (cleanupErr) {
                console.error("Failed to cleanup dbSession:", cleanupErr);
            }
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}