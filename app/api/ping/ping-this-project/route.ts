import { after, NextResponse, type NextRequest } from "next/server"
import PingModel from "@/models/PingSchema"
import userModel from "@/models/UserModel"
import { ConnectoDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import { EmailSender } from "@/lib/email/send"
import { postMyGigPingTemplate } from "@/lib/email/templates"
import ProjectModel from "@/models/ProjectModel"
import resend from "@/lib/resend"
import Activity from "@/models/ActivityModel"
import redis from "@/lib/redis"
import { canUserPerformAction, incrementUserUsage } from "@/lib/subscription/engine"
import { ACTION_TYPES } from "@/lib/subscription/config/subscriptions"
import { dispatchNotification } from "@/lib/notification/dispatcher"

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          message: "You must be logged in to apply for projects",
        },
        { status: 401 },
      )
    }

    if (session.user.role === "client") {
      return NextResponse.json(
        {
          message: "Clients cannot apply for gigs. Please switch to Freelancer mode in the top navigation to apply.",
        },
        { status: 403 }
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

    if (message.length > 2000) {
      return NextResponse.json(
        { message: "Pitch message cannot exceed 3,000 characters." },
        { status: 400 }
      );
    }


    const [poster, fetchedProject, existingPing] = await Promise.all([
      userModel.findById(posterId).lean(),
      ProjectModel.findById(projectId).lean(),
      PingModel.findOne({ projectId, userEmail: session.user.email }).lean(),
    ]);

    if (!poster) {
      return NextResponse.json({ message: "Project owner not found" }, { status: 404 });
    }
    if (!fetchedProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    if (existingPing) {
      const isRejected = existingPing.status === "rejected";
      return NextResponse.json(
        { message: isRejected ? "Your application for this project was previously declined" : "You have already applied for this project" },
        { status: 400 }
      );
    }

    const posterEmail = poster?.email

    const quotaCheck = await canUserPerformAction(
      session.user.id,
      session.user.email!,
      "freelancer",
      ACTION_TYPES.SEND_PING
    )

    if (!quotaCheck.canPerform) {
      return NextResponse.json(
        { message: quotaCheck.reason, limitReached: true },
        { status: 403 }
      );
    }

    // Create the ping with optional fields
    const ping = await PingModel.create({
      projectId,
      userEmail,
      posterId,
      posterEmail,
      message,
      bestWorkLink: bestWorkLink || "",
      bestWorkDescription: bestWorkDescription || "",
    })

    await incrementUserUsage(session.user.id, session.user.email!, ACTION_TYPES.SEND_PING)

    //config html email
    const emailData = postMyGigPingTemplate({
      receiverName: poster.name || "Project Owner",
      senderName: session.user.name || "Applicant",
      senderEmail: userEmail,
      gigId: ping.projectId,
      gigTitle: fetchedProject.title || "Untitled Project",
      message: message,
    })


    after(async () => {
      //send email
      const { error } = await resend.emails.send({
        from: 'PostMyGig <hello@postmygig.vercel.app>',
        to: posterEmail,
        subject: `New Application for Your Project: ${ping.projectId}`,
        html: emailData
      })

      if (error) {
        await EmailSender({
          to: posterEmail,
          subject: `New Application for Your Project: ${ping.projectId}`,
          html: emailData,
        })
      }

      // Send in-app notification to project owner
      await dispatchNotification({
        recipientEmail: posterEmail,
        senderEmail: userEmail,
        senderName: session.user.name || "Applicant",
        type: "ping_received",
        title: "New Pitch Received",
        message: `${session.user.name || "A freelancer"} pitched for your project: "${fetchedProject.title || 'Gig'}"`,
        link: `/open-gig/${projectId}`,
      })
    })

    after(async () => {
      // save activity
      if (session.user.activityPublic !== false) {
        await Activity.create({
          userId: session.user.id,
          gigId: fetchedProject.id,
          type: 'applied',
          metadata: {
            freelancerName: session.user.name || "Freelancer",
            gigTitle: fetchedProject.title,
            skills: (fetchedProject.skillsRequired || []).slice(0, 3),
            budget: fetchedProject.budget || "",
          }
        });
        await redis.del("real-time-activity-data");
        await redis.del("public-success-feed");
      }

      // Invalidate dashboard caches for both applicant and project owner
      try {
        const freelancerKeys = await redis.keys(`dashboard-data:freelancer:${userEmail}*`);
        const clientKeys = await redis.keys(`dashboard-data:client:${posterEmail}*`);
        const keysToDelete = [...freelancerKeys, ...clientKeys];
        if (keysToDelete.length > 0) {
          await redis.del(...keysToDelete);
        }
      } catch (err) {
        console.warn("Failed to invalidate dashboard cache on ping:", err);
      }
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
