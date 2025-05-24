import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";

interface ContactLinks {
  label: string;
  url: string;
}

export async function PATCH(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const body = await req.json();

    const {
      userId,
      name,
      email,
      bio,
      contactLinks,
      location,
      role,
      skills,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (
      contactLinks &&
      (!Array.isArray(contactLinks) ||
        !contactLinks.every(
          (link) =>
            typeof link.label === "string" &&
            typeof link.url === "string"
        ))
    ) {
      return NextResponse.json(
        { error: "Invalid contactLinks format" },
        { status: 400 }
      );
    }

    if (
      skills &&
      (!Array.isArray(skills) || !skills.every((s) => typeof s === "string"))
    ) {
      return NextResponse.json({ error: "Invalid skills format" }, { status: 400 });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        bio,
        contactLinks,
        location,
        role,
        skills,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
