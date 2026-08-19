import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 });
        }
        const { applicantEmail } = await req.json();
        if (!applicantEmail) {
            return NextResponse.json({ error: "Applicant email is required" }, { status: 400 });
        }

        const foundApplicant = await userModel.findOne({ email: applicantEmail });
        if (!foundApplicant) {
            return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
        }

        // Fetch its contact details with privacy settings respected
        const contactDetails = {
            email: foundApplicant.showEmail !== false ? foundApplicant.email : null,
            contactLinks: foundApplicant.showContactLinks !== false ? (foundApplicant.contactLinks || []) : [],
        };

        return NextResponse.json({ contactDetails }, { status: 200 });
    } catch (error) {
        console.error("Error fetching contact details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}