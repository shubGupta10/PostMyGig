import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { seedPlatformDatabase } from "@/scripts/seed-platform-prod";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;

    // Check for bearer token or authenticated admin session
    let isAuthorized = false;

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    } else {
      const session = await getServerSession(authOptions);
      if (session?.user?.role === "admin") {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Unauthorized. Admin role or valid bearer token required." },
        { status: 401 }
      );
    }

    const result = await seedPlatformDatabase();

    return NextResponse.json({
      message: "Platform seeded successfully on production database.",
      result,
    });
  } catch (error: any) {
    console.error("Failed to seed platform:", error);
    return NextResponse.json(
      { message: "Seeding failed", error: error.message },
      { status: 500 }
    );
  }
}
