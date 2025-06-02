import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";
import userModel from "@/models/UserModel";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get("gigId");

    if (!gigId) {
      return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
    }

    const applications = await PingModel.find({ projectId: gigId });

    if (applications.length === 0) {
      return NextResponse.json({ error: "No applications found for this gig" }, { status: 200 });
    }

    const applicationsWithUserData = await Promise.all(
      applications.map(async (application) => {
        const userMail = application.userEmail;

        let user = null;
        if (Types.ObjectId.isValid(userMail)) {
          user = await userModel.findOne({email: userMail}).select("name email profilePhoto");
        } else {
          user = await userModel.findOne({ email: userMail }).select("name email profilePhoto");
        }
        

        return {
          ...application.toObject(),
          applicant: user || null, 
        };
      })
    );

    return NextResponse.json(
      {
        message: "Applications fetched successfully",
        data: applicationsWithUserData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching applications",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
