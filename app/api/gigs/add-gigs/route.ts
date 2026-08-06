import { after, NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import ProjectModel from "@/models/ProjectModel"
import { ConnectoDatabase } from "@/lib/db"
import redis from "@/lib/redis"
import Activity from "@/models/ActivityModel"
import { canUserPerformAction, incrementUserUsage } from "@/lib/subscription/engine"
import { ACTION_TYPES } from "@/lib/subscription/config/subscriptions"

interface ContactInfo {
  email?: string
  whatsapp?: string
  x?: string
}

interface RequestBody {
  title: string
  description: string
  skillsRequired: string[]
  contact: ContactInfo
  expiresAt: string
  displayContactLinks: boolean
  budget: string
}

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase()

    const { title, description, skillsRequired, contact, expiresAt, budget, displayContactLinks }: RequestBody =
      await req.json()

    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Validation
    if (
      !title ||
      !description ||
      !skillsRequired ||
      !contact ||
      !expiresAt ||
      !budget ||
      displayContactLinks === undefined
    ) {
      return NextResponse.json({ message: "Please fill all details" }, { status: 400 })
    }

    // Validate skillsRequired is an array
    if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
      return NextResponse.json({ message: "Skills required must be a non-empty array" }, { status: 400 })
    }

    const cleanContact: ContactInfo = {}
    if (contact.email && contact.email.trim()) {
      cleanContact.email = contact.email.trim()
    }
    if (contact.whatsapp && contact.whatsapp.trim()) {
      cleanContact.whatsapp = contact.whatsapp.trim()
    }
    if (contact.x && contact.x.trim()) {
      cleanContact.x = contact.x.trim()
    }

    const quotaCheck = await canUserPerformAction(
      session.user.id,
      session.user.email!,
      "client",
      ACTION_TYPES.POST_GIG
    );
    if (!quotaCheck.canPerform) {
      return NextResponse.json({
        message: quotaCheck.reason, limitReached: true
      }, { status: 403 })
    }

    const newGig = new ProjectModel({
      title: title.trim(),
      description: description.trim(),
      createdBy: session.user.email,
      skillsRequired: skillsRequired.map((skill) => skill.trim()).filter((skill) => skill.length > 0),
      contact: cleanContact,
      status: "active",
      expiresAt: new Date(expiresAt),
      budget: budget.trim(),
      displayContactLinks: displayContactLinks === true,
    })

    await newGig.save()
    await incrementUserUsage(session.user.id, session.user.email!, ACTION_TYPES.POST_GIG);

    try {
      const keys = await redis.keys("fetch-gigs:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      console.log("Invalidated dynamic gig caches");
    } catch (redisError) {
      console.warn("Failed to invalidate Redis cache:", redisError);
    }


    after(async () => {
      //save activity
      if (session.user.activityPublic === true) {
        await Activity.create({
          userId: session.user.id,
          gigId: newGig.id,
          type: 'posted',
          metadata: {
            FullName: session.user.name,
            gigTitle: newGig.title,
          }
        })
        await redis.del("real-time-activity-data");
      }
    })

    return NextResponse.json({ message: "Gig created successfully", gig: newGig }, { status: 201 })
  } catch (error) {
    console.error("Error creating gig:", error)
    return NextResponse.json({ message: "Failed to create gig" }, { status: 500 })
  }
}
