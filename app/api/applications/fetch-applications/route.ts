import { NextResponse, NextRequest } from "next/server";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { calculateRecommendations } from "./utils";
import { ConnectoDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get("gigId");

    if (!gigId) {
      return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
    }

    const gig = await ProjectModel.findById(gigId).select("title skillsRequired").lean();

    const rawApplications = await PingModel.aggregate([
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
    ]);

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
