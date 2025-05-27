import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import PingModel from "@/models/PingSchema";

export async function POST(req: NextRequest){
    try {
        const {userEmail, projectId} = await req.json();
        if (!userEmail || !projectId) {
            return NextResponse.json({error: "Missing userEmail or projectId"}, {status: 400});
        }

        //check if user ping this project or not
        const ifUserPinged = await PingModel.findOne({userEmail: userEmail, projectId: projectId})
        if (ifUserPinged) {
            return NextResponse.json({pinged: true}, {status: 200});
        } else {
            return NextResponse.json({pinged: false}, {status: 200});
        }

        return NextResponse.json({
            message: "Ping check completed successfully",
            pinged: ifUserPinged ? true : false
        }, {status: 200});
    } catch (error) {
        console.error("Error checking ping status:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}