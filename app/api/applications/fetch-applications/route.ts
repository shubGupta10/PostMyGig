import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { calculateRecommendations } from "./utils";
import { ConnectoDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({
        message: "Unauthorized"
      }, { status: 404 })
    }
    await ConnectoDatabase();
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get("gigId");

    if (!gigId) {
      return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
    }

    const [gig, rawApplications] = await Promise.all([
      ProjectModel.findById(gigId).select("title skillsRequired createdBy").lean(),
      PingModel.aggregate([
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
              _id: "$applicantArray._id",
              name: "$applicantArray.name",
              email: "$applicantArray.email",
              profilePhoto: "$applicantArray.profilePhoto",
              bio: "$applicantArray.bio",
              skills: "$applicantArray.skills",
              portfolioProjects: "$applicantArray.portfolioProjects",
              isVerified: "$applicantArray.isVerified",
            }
          }
        },
        {
          $project: {
            applicantArray: 0
          }
        }
      ])
    ]);


    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    if (gig?.createdBy !== session.user.email) {
      return NextResponse.json({
        message: "Forbidden. You are not allowed to view applicants for this gig."
      }, { status: 404 })
    }

    if (!rawApplications || rawApplications.length === 0) {
      return NextResponse.json({
        message: "No applications found for this gig",
        data: {
          recommendedApplications: [],
          restApplications: [],
        },
        gigDetails: {
          title: gig?.title || "",
          skillsRequired: gig?.skillsRequired || [],
        }
      }, { status: 200 });
    }

    const { recommendedApplications, restApplications } = calculateRecommendations(
      rawApplications,
      gig?.skillsRequired || []
    );

    return NextResponse.json({
      message: "Applications fetched successfully",
      data: {
        recommendedApplications,
        restApplications,
      },
      gigDetails: {
        title: gig?.title || "",
        skillsRequired: gig?.skillsRequired || [],
      },
    });
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
