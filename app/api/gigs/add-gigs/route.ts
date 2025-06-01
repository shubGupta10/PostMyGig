import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import ProjectModel from "@/models/ProjectModel"
import { ConnectoDatabase } from "@/lib/db"
import redis from "@/lib/redis"

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

    // Update Redis cache after creating a new gig
    const cacheKey = "fetch-gigs:all"

    try {
      // Method 1: Update the existing cache by adding the new gig
      const cachedGigsString = await redis.get(cacheKey)

      if (cachedGigsString) {
        // Parse existing cache
        const cachedGigs = typeof cachedGigsString === "string" ? JSON.parse(cachedGigsString) : cachedGigsString

        // Add the new gig to the beginning of the array (newest first)
        const updatedCache = [newGig.toObject(), ...cachedGigs]

        // Update the cache with the new array
        await redis.set(cacheKey, JSON.stringify(updatedCache), { ex: 300 }) // 5 minutes cache

        console.log("Redis cache updated with new gig")
      } else {
        // If no cache exists, create a new cache with just this gig
        await redis.set(cacheKey, JSON.stringify([newGig.toObject()]), { ex: 300 })
        console.log("New Redis cache created with gig")
      }
    } catch (redisError) {
      // If updating the cache fails, delete the cache so the next GET request will fetch fresh data
      console.warn("Failed to update Redis cache:", redisError)
      try {
        await redis.del(cacheKey)
        console.log("Redis cache invalidated")
      } catch (deleteError) {
        console.warn("Failed to invalidate Redis cache:", deleteError)
      }
    }

    return NextResponse.json({ message: "Gig created successfully", gig: newGig }, { status: 201 })
  } catch (error) {
    console.error("Error creating gig:", error)
    return NextResponse.json({ message: "Failed to create gig" }, { status: 500 })
  }
}
