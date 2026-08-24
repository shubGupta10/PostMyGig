import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import ContractModel from "@/modules/contracts/models/ContractModel";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contractId, fileUrl, fileName, comment } = body;

    if (!contractId || !fileUrl || !fileName) {
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
      return NextResponse.json({ error: "Contract is already active and cannot be revised." }, { status: 400 });
    }

    if (isClient && contract.status !== 'pending_client') {
      return NextResponse.json({ error: "It is not your turn to revise." }, { status: 403 });
    }

    if (isFreelancer && contract.status !== 'pending_freelancer') {
      return NextResponse.json({ error: "It is not your turn to revise." }, { status: 403 });
    }

    const ProjectModel = (await import("@/modules/gigs/models/ProjectModel")).default;
    const project = await ProjectModel.findById(contract.projectId).lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (['in_progress', 'completed', 'expired', 'cancelled'].includes(project.status)) {
      return NextResponse.json({ error: "This project is no longer active for contract negotiations." }, { status: 400 });
    }

    const newStatus = isClient ? 'pending_freelancer' : 'pending_client';

    contract.revisions.push({
      uploadedBy: session.user.email,
      fileUrl,
      fileName,
      comment: comment || '',
      timestamp: new Date()
    });

    contract.status = newStatus;
    await contract.save();

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
