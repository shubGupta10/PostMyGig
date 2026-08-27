import { NextResponse, NextRequest, after } from "next/server";
import userModel from "@/modules/users/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { EmailSender } from "@/lib/email/send";
import { postMyGigChatInvitationTemplate } from "@/lib/email/templates";
import redis from "@/lib/redis";
import resend from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase();

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    const projectData = await ProjectModel.findById(projectId).lean();
    if (!projectData) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const posterEmail = projectData.createdBy;

    let applyerEmail = projectData.AcceptedFreelancerEmail;

    if (!applyerEmail) {
      const acceptedPing = await PingModel.findOne({ projectId, status: "accepted" }).lean();
      applyerEmail = acceptedPing?.userEmail;
    }

    if (!applyerEmail) {
      const activePing = await PingModel.findOne({ projectId, status: { $ne: "rejected" } }).lean();
      applyerEmail = activePing?.userEmail;
    }

    if (!posterEmail || !applyerEmail) {
      return NextResponse.json({ message: "Chat participants not found" }, { status: 404 });
    }

    const [posterData, applyerData] = await Promise.all([
      userModel.findOne({ email: posterEmail }).select("name email profilePhoto bio role skills location").lean(),
      userModel.findOne({ email: applyerEmail }).select("name email profilePhoto bio role skills location").lean(),
    ]);

    if (!posterData) {
      return NextResponse.json({ message: "Poster not found" }, { status: 404 });
    }

    if (!applyerData) {
      return NextResponse.json({ message: "Applicant not found" }, { status: 404 });
    }

    const redisKey = `invite_sent:${projectId}:${applyerEmail}`;
    const alreadySent = await redis.get(redisKey);

    if (alreadySent) {
      return NextResponse.json({
        message: "Invitation already sent recently",
        posterData,
        applyerData,
        projectStatus: projectData.status,
      }, { status: 200 });
    }

    after(async () => {
      // Send email notification to the accepted freelancer
      const { error } = await resend.emails.send({
        from: 'PostMyGig <hello@postmygig.vercel.app>',
        to: applyerData.email,
        subject: "You've been invited to chat about a project",
        html: postMyGigChatInvitationTemplate({
          applyerName: applyerData.name,
          posterName: posterData.name,
          projectId,
          projectName: projectData.title,
        }),
      });

      if (error) {
        await EmailSender({
          to: applyerData.email,
          subject: "You've been invited to chat about a project",
          html: postMyGigChatInvitationTemplate({
            applyerName: applyerData.name,
            posterName: posterData.name,
            projectId,
            projectName: projectData.title,
          }),
        });
      }
    });

    await redis.set(redisKey, "true", { ex: 172800 }); // 48 hours

    return NextResponse.json({
      message: "Invitation sent successfully",
      posterData,
      applyerData,
      projectStatus: projectData.status,
      projectTitle: projectData.title,
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Chat Participants Error:", error);
    return NextResponse.json({
      message: "Internal server error",
    }, { status: 500 });
  }
}
