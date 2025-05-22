import { NextRequest, NextResponse } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";

export async function GET(req: NextRequest) {
  try {
    await ConnectoDatabase();

    // `.lean()` makes sure the result is plain JSON, not a Mongoose document
    const gigs = await ProjectModel.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ gigs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json(
      { message: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}
