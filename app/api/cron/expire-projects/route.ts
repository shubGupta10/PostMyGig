import ProjectModel from "@/models/ProjectModel";
import { NextRequest, NextResponse } from "next/server";
import { ConnectoDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const now = new Date();
        const result = await ProjectModel.updateMany(
            { expiresAt: { $lt: now }, status: { $nin: ["expired", "completed", "accepted"] } },
            { $set: { status: "expired" } }
        )

        return NextResponse.json({
            message: "Projects expired successfully",
            modified: result.modifiedCount
        })
    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
    }
}