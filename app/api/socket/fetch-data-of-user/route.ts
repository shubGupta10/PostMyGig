import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { EmailSender } from "@/lib/email/send";
import { postMyGigChatInvitationTemplate } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase();

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    // Fetch project details
    const projectData = await ProjectModel.findById(projectId).lean();
    if (!projectData) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const projectName = projectData.title;

    // Get ping info to determine poster and applicant
    const pingData = await PingModel.findOne({ projectId }).lean();
    if (!pingData) {
      return NextResponse.json({ message: "Ping not found" }, { status: 404 });
    }

    const { posterEmail, userEmail: applyerEmail } = pingData;

    // Fetch user data but exclude password and sensitive fields
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

    // Send email to the applicant
    await EmailSender({
      to: applyerData.email,
      subject: "You've been invited to chat about a project",
      html: postMyGigChatInvitationTemplate({
        applyerName: applyerData.name,
        posterName: posterData.name,
        projectId,
        projectName,
      }),
    });

    return NextResponse.json({
      message: "Invitation sent successfully",
      posterData: posterData,
      applyerData: applyerData,
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Chat Participants Error:", error);
    return NextResponse.json({
      message: "Internal server error",
    }, { status: 500 });
  }
}
