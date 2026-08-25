import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await redis.flushdb();

    return NextResponse.json({ message: "All cache cleared successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error clearing cache:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
