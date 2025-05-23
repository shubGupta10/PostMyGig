import { NextResponse, type NextRequest } from "next/server"
import PingModel from "@/models/PingSchema"
import userModel from "@/models/UserModel"
import { ConnectoDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase()

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          message: "You must be logged in to apply for projects",
        },
        { status: 401 },
      )
    }

    const { projectId, userEmail, posterId, message, bestWorkLink, bestWorkDescription } = await req.json()

    // Validate required fields
    if (!projectId || !userEmail || !posterId || !message) {
      return NextResponse.json(
        {
          message: "Missing required project information",
        },
        { status: 400 },
      )
    }

    // Validate user ID matches session
    if (userEmail !== session.user.email) {
      return NextResponse.json(
        {
          message: "User email mismatch",
        },
        { status: 403 },
      )
    }

    // Message is required
    if (!message || message.trim() === "") {
      return NextResponse.json(
        {
          message: "Please provide a message to the project owner",
        },
        { status: 400 },
      )
    }

    // Find the poster
    const poster = await userModel.findById(posterId)
    if (!poster) {
      return NextResponse.json(
        {
          message: "Project owner not found",
        },
        { status: 404 },
      )
    }

    const posterEmail = poster?.email

    // Create the ping with optional fields
    const ping = await PingModel.create({
      projectId,
      userEmail,
      posterId,
      posterEmail,
      message,
      bestWorkLink: bestWorkLink || "", // Make optional
      bestWorkDescription: bestWorkDescription || "", // Make optional
    })

    return NextResponse.json(
      {
        message: "Your application has been submitted successfully!",
        ping,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating ping:", error)
    return NextResponse.json(
      {
        message: "Something went wrong while submitting your application",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
