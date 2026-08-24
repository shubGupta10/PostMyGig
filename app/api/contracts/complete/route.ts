import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import ContractModel from "@/modules/contracts/models/ContractModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contractId } = body;

    if (!contractId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ConnectoDatabase();

    const contract = await ContractModel.findById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (contract.clientId !== session.user.email) {
      return NextResponse.json({ error: "Only the client can mark the contract as completed" }, { status: 403 });
    }

    if (contract.status !== 'active') {
      return NextResponse.json({ error: "Contract is not active" }, { status: 400 });
    }

    contract.status = 'completed';
    await contract.save();

    await ProjectModel.findByIdAndUpdate(contract.projectId, {
      status: 'completed'
    });

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
