import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import ContractModel from "@/modules/contracts/models/ContractModel";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, freelancerEmail, fileUrl, fileName } = body;

    if (!projectId || !freelancerEmail || !fileUrl || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ConnectoDatabase();

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.createdBy !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    if (['in_progress', 'completed', 'expired', 'cancelled'].includes(project.status)) {
      return NextResponse.json({ error: "This project is no longer accepting new contracts." }, { status: 400 });
    }

    const existingContract = await ContractModel.findOne({
      projectId,
      clientId: session.user.email,
      freelancerId: freelancerEmail
    });

    if (existingContract) {
      return NextResponse.json({ error: "Contract already exists" }, { status: 400 });
    }

    // CRITICAL FIX: Ensure the freelancer actually applied and was accepted for this project
    const ping = await PingModel.findOne({ 
      projectId, 
      userEmail: freelancerEmail, 
      status: { $in: ['accepted', 'contract_offered'] } 
    });

    if (!ping) {
       return NextResponse.json({ error: "Freelancer has not been accepted for this project." }, { status: 403 });
    }

    const newContract = await ContractModel.create({
      projectId,
      clientId: session.user.email,
      freelancerId: freelancerEmail,
      status: 'pending_freelancer',
      revisions: [
        {
          uploadedBy: session.user.email,
          fileUrl,
          fileName,
          timestamp: new Date()
        }
      ]
    });

    await PingModel.findOneAndUpdate(
      { projectId, userEmail: freelancerEmail },
      { status: 'contract_offered' }
    );

    await ProjectModel.findByIdAndUpdate(projectId, {
      status: 'contract_offered'
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
