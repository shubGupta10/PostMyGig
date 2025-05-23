import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";


export async function DELETE(req: NextRequest){
    try {
        const {applicationId} = await req.json();
        if(!applicationId) return NextResponse.json({message: "Application ID is required"}, {status: 400});

        const ping = await PingModel.findByIdAndDelete(applicationId);
        if(!ping) return NextResponse.json({message: "Application not found"}, {status: 404});

        return NextResponse.json({message: "Application deleted successfully"}, {status: 200});
    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json({message: "Error deleting application"}, {status: 500});
    }
}