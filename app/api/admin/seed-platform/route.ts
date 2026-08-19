import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { seedPlatformDatabase } from "@/scripts/seed-platform-prod";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in as admin." },
        { status: 401 }
      );
    }

    await ConnectoDatabase();
    const dbUser = await userModel.findOne({ email: session.user.email });

    if (!dbUser || (dbUser.isAdmin !== true && dbUser.role !== "admin")) {
      return NextResponse.json(
        { message: "Forbidden. Admin privileges required." },
        { status: 403 }
      );
    }

    const result = await seedPlatformDatabase();

    return NextResponse.json({
      success: true,
      message: "Platform successfully seeded with authentic client briefs.",
      result,
    });
  } catch (err: any) {
    console.error("Seed platform API error:", err);
    return NextResponse.json(
      { message: "Internal server error during platform seeding", error: err.message },
      { status: 500 }
    );
  }
}
