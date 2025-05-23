import { NextRequest, NextResponse } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user.id || !session?.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Fetch total projects
    const totalProjects = await ProjectModel.countDocuments({ createdBy: userEmail });

    // Fetch total pings
    const totalPings = await PingModel.countDocuments({ userEmail });

    // Get full list of projects
    const allProjects = await ProjectModel.find({ createdBy: userEmail }).lean();

    return NextResponse.json({
      message: "Dashboard data fetched successfully",
      dashboard: {
        totalProjects,
        totalPings,
        projects: allProjects,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error in dashboard API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
