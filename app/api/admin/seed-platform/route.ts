import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { seedPlatformDatabase } from "@/scripts/seed-platform-prod";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;

    let isAuthorized = false;

    // 1. Check Bearer token
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    }

    // 2. Check NextAuth Session
    if (!isAuthorized) {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        if (session.user.isAdmin === true || session.user.role === "admin") {
          isAuthorized = true;
        } else if (session.user.email) {
          // Verify directly in DB
          await ConnectoDatabase();
          const dbUser = await userModel.findOne({ email: session.user.email });
          if (dbUser && (dbUser.isAdmin === true || dbUser.role === "admin")) {
            isAuthorized = true;
          }
        }
      }
    }

    // 3. Check JSON body email fallback
    if (!isAuthorized) {
      try {
        const body = await req.json().catch(() => ({}));
        if (body.userEmail) {
          await ConnectoDatabase();
          const dbUser = await userModel.findOne({ email: body.userEmail });
          if (dbUser && (dbUser.isAdmin === true || dbUser.role === "admin")) {
            isAuthorized = true;
          }
        }
      } catch (e) {
        // ignore body parse error
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Unauthorized. Admin privileges or valid bearer token required." },
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
