import { NextResponse, NextRequest } from "next/server";
import userModel from "@/modules/users/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";

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

    return NextResponse.json({
      message: "Chat participants loaded successfully",
      posterData,
      applyerData,
      projectData,
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Chat Participants Error:", error);
    return NextResponse.json({
      message: "Internal server error",
    }, { status: 500 });
  }
}
