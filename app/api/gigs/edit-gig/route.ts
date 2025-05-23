import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const { gigId, title, description, budget, status, expiresAt } = await req.json();
        if (!gigId || !title || !description || !budget || !status || !expiresAt) {
            return NextResponse.json({ message: "Please fill all fields" }, { status: 400 });
        }

        const findGig = await ProjectModel.findById(gigId);
        if (!findGig) {
            return NextResponse.json({ message: "Gig not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        const createdBy = session?.user.id;

        if (findGig.createdBy.toString() !== createdBy) {
            return NextResponse.json({
                message: "You are not allowed to edit this gig"
            }, { status: 403 })
        }

        const updatedGig = await ProjectModel.findByIdAndUpdate(gigId, {
            title,
            description,
            budget,
            status,
            expiresAt
        }, { new: true });

        return NextResponse.json({
            message: "Gig updated successfully",
            gig: updatedGig
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating gig:", error);
        return NextResponse.json({
            message: "Failed to update gig"
        }, { status: 500 });
    }
}