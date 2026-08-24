import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import ContractModel from "@/modules/contracts/models/ContractModel";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const freelancerEmail = searchParams.get("freelancerEmail");

    if (!projectId || !freelancerEmail) {
      return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
    }

    await ConnectoDatabase();

    const contract = await ContractModel.findOne({
      projectId,
      freelancerId: freelancerEmail
    });

    if (!contract) {
      const ProjectModel = (await import("@/modules/gigs/models/ProjectModel")).default;
      const project = await ProjectModel.findById(projectId).lean();
      
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      const isClient = project?.createdBy === session.user.email;

      if (!isClient && session.user.email !== freelancerEmail) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({
        contract: null,
        isClient,
        isMyTurn: isClient
      }, { status: 200 });
    }

    const isClient = contract.clientId === session.user.email;
    const isFreelancer = contract.freelancerId === session.user.email;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isMyTurn =
      (isClient && contract.status === 'pending_client') ||
      (isFreelancer && contract.status === 'pending_freelancer');

    return NextResponse.json({ contract, isClient, isMyTurn }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
