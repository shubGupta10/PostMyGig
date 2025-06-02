import FeedbackModel from "@/models/FeedbackModel";
import { ConnectoDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function DELETE(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const { feedbackId, userEmail } = await req.json();

        if (!feedbackId || !userEmail) {
            return NextResponse.json(
                { message: "FeedbackId and userEmail are required" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized: Session not found" },
                { status: 401 }
            );
        }

        const user = session.user;

        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        const deletedFeedback = await FeedbackModel.findByIdAndDelete(feedbackId);

        if (!deletedFeedback) {
            return NextResponse.json(
                { message: "Feedback not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Feedback deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE Feedback error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
