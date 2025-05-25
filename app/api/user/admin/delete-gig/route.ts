import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";

export async function DELETE(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const { userEmail, gigId } = await req.json();

        if (!userEmail) {
            return NextResponse.json({
                message: "User Email not found"
            }, { status: 400 })
        }

        if (!gigId) {
            return NextResponse.json({
                message: "Gig ID is required"
            }, { status: 400 });
        }


        const fetchCurrentUser = await userModel.findOne({ email: userEmail });
        if (!fetchCurrentUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 });
        }

        if (fetchCurrentUser.role !== 'admin') {
            return NextResponse.json({
                message: "Only Admin is allowed to this route"
            }, { status: 403 })
        }

        //admin can delete an gig
        const deleteProject = await ProjectModel.findByIdAndDelete(gigId);

        return NextResponse.json({
            message: "Gig Deleted",
        }, { status: 200 })

    } catch (error) {
        console.error("Delete Gig Error:", error);
        return NextResponse.json({
            message: "Failed to delete gig",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
