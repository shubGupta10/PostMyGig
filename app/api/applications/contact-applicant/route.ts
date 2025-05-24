import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";

export async function POST(req: NextRequest){
    try {
        const {applicantEmail} = await req.json();
        if (!applicantEmail) {
            return NextResponse.json({ error: "Applicant email is required" }, { status: 400 });
        }

        const foundApplicant = await userModel.findOne({ email: applicantEmail });
        if (!foundApplicant) {
            return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
        }

        //fetch its contact details
        const contactDetails = {
            email: foundApplicant.email,
            contactLinks: foundApplicant.contactLinks || [],
        }

        return NextResponse.json({ contactDetails }, { status: 200 });
    } catch (error) {
        console.error("Error fetching contact details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}