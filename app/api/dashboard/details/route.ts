import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import { useSession } from "next-auth/react";


export async function GET(req: NextRequest){
    try {
        await ConnectoDatabase();
        const session = useSession();
        if(session.status !== "authenticated"){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const user = session.data.user.id;
    } catch (error) {
        
    }
}