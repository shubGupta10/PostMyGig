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
    const { contractId, finalContractUrl } = body;

    if (!contractId || !finalContractUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ConnectoDatabase();

    const contract = await ContractModel.findById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const isClient = contract.clientId === session.user.email;
    const isFreelancer = contract.freelancerId === session.user.email;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (contract.status === 'active') {
      return NextResponse.json({ error: "Contract is already active." }, { status: 400 });
    }

    if (isClient && contract.status !== 'pending_client') {
      return NextResponse.json({ error: "It is not your turn to accept." }, { status: 403 });
    }
    
    if (isFreelancer && contract.status !== 'pending_freelancer') {
      return NextResponse.json({ error: "It is not your turn to accept." }, { status: 403 });
    }

    const project = await ProjectModel.findById(contract.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    // Prevent race conditions where another freelancer already accepted a contract for this project
    if (['in_progress', 'completed', 'expired', 'cancelled'].includes(project.status)) {
      return NextResponse.json({ error: "This project is no longer available for contract acceptance." }, { status: 400 });
    }

    contract.status = 'active';
    contract.finalContractUrl = finalContractUrl;
    await contract.save();

    // Update Project Status
    await ProjectModel.findByIdAndUpdate(contract.projectId, {
      status: 'in_progress',
      AcceptedFreelancerEmail: contract.freelancerId
    });

    // Update Ping Status
    await PingModel.findOneAndUpdate(
      { projectId: contract.projectId, userEmail: contract.freelancerId },
      { status: 'in_progress' }
    );

    // Optional: Reject all other pending pings for this project
    await PingModel.updateMany(
      { projectId: contract.projectId, status: { $in: ['pending', 'accepted', 'contract_offered'] }, userEmail: { $ne: contract.freelancerId } },
      { status: 'rejected' }
    );

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
