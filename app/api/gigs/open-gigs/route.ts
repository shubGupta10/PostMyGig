import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const {gigId} = await req.json();
        if (!gigId) {
            return NextResponse.json({
                message: "Gig ID is required"
            }, { status: 400 })
        }

        const gig = await ProjectModel.findById(gigId);
        if (!gig) {
            return NextResponse.json({
                message: "Gig not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Gig found",
            gig: gig
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 })
    }
}