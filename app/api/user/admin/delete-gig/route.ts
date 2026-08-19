import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function DELETE(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 404 })
        }

        //check if this user is admin
        if (session.user.isAdmin !== true) {
            return NextResponse.json({
                message: "Not a admin account"
            }, { status: 404 })
        }

        await ConnectoDatabase();

        const { userEmail, gigId } = await req.json();

        if (!userEmail) {
            return NextResponse.json({
                message: "User Email not found"
            }, { status: 400 })
        }

        if (session.user.email !== userEmail) {
            return NextResponse.json({
                message: "Unauthorized Access"
            }, { status: 404 })
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

        if (fetchCurrentUser.isAdmin !== true) {
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
