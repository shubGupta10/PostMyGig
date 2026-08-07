import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get("gigId");

    if (!gigId) {
      return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
    }

    const applicationWithUserData = await PingModel.aggregate([
      {
        $match: {
          projectId: gigId,
          status: { $ne: "rejected" }
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userEmail",
          foreignField: "email",
          as: "applicantArray"
        }
      },
      {
        $unwind: {
          path: "$applicantArray",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          applicant: {
            name: "$applicantArray.name",
            email: "$applicantArray.email",
            profilePhoto: "$applicantArray.profilePhoto"
          }
        }
      },
      {
        $project: {
          applicantArray: 0
        }
      }
    ]);

    if (applicationWithUserData.length === 0) {
      return NextResponse.json({ error: "No application found for this gig" }, { status: 200 })
    }

    return NextResponse.json({
      message: "Application fetched successfully",
      data: applicationWithUserData
    })
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
