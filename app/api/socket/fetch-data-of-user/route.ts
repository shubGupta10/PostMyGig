import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { EmailSender } from "@/lib/email/send";
import { postMyGigChatInvitationTemplate } from "@/lib/email/templates";
import redis from "@/lib/redis";  // Upstash redis client import

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

    const pingData = await PingModel.findOne({ projectId }).lean();
    if (!pingData) {
      return NextResponse.json({ message: "Ping not found" }, { status: 404 });
    }

    const { posterEmail, userEmail: applyerEmail } = pingData;

    const [posterData, applyerData] = await Promise.all([
      userModel.findOne({ email: posterEmail }).select("name email").lean(),
      userModel.findOne({ email: applyerEmail }).select("name email").lean(),
    ]);

    if (!posterData) {
      return NextResponse.json({ message: "Poster not found" }, { status: 404 });
    }

    if (!applyerData) {
      return NextResponse.json({ message: "Applicant not found" }, { status: 404 });
    }

    const redisKey = `invite_sent:${projectId}:${applyerEmail}`;

    // Check if invite was already sent recently
    const alreadySent = await redis.get(redisKey);
    if (alreadySent) {
      return NextResponse.json({ message: "Invitation already sent recently" }, { status: 200 });
    }

    // Send email
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

    // Set key with expiry of 24 hours (86400 seconds)
    await redis.set(redisKey, "true", { ex: 600 });

    return NextResponse.json({
      message: "Invitation sent successfully",
      posterData,
      applyerData,
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Chat Participants Error:", error);
    return NextResponse.json({
      message: "Internal server error",
    }, { status: 500 });
  }
}
