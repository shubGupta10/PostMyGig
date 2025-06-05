import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import userModel from "@/models/UserModel";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const { gigId } = await req.json();

    if (!gigId) {
      return NextResponse.json({
        message: "Gig ID is required"
      }, { status: 400 });
    }

    // const session = await getServerSession(authOptions);
    // const user = session?.user;

    // if (!user) {
    //     return NextResponse.json({
    //         message: "User not authenticated"
    //     }, { status: 401 });
    // }

    const gig = await ProjectModel.findById(gigId).lean();

    if (!gig) {
      return NextResponse.json({
        message: "Gig not found"
      }, { status: 404 });
    }

    // Remove contact info if not meant to be displayed
    if (!gig.displayContactLinks) {
      delete gig.contact;
    }

    const owner = await userModel.findOne({ email: gig.createdBy }).lean();

    return NextResponse.json({
      message: "Gig found",
      gig: gig,
      owner: {
        id: owner?._id,
        name: owner?.name,
        email: owner?.email,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching gig:", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const { gigId } = await req.json();

    if (!gigId) {
      return NextResponse.json({
        message: "Gig ID is required"
      }, { status: 400 })
    }

    const gig = await ProjectModel.findById(gigId).lean();
    if (!gig) {
      return NextResponse.json({
        message: "Gig not found"
      }, { status: 404 })
    }

    const cacheKey = `fetch-gigs:all`;

    await ProjectModel.findByIdAndDelete(gigId);

    await redis.del(cacheKey);


    return NextResponse.json({
      message: "Gig deleted successfully"
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) {
      return NextResponse.json(
        {
          message: "User not authenticated",
        },
        { status: 401 },
      )
    }

    const body = await req.json()
    const { gigId, displayContactLinks } = body

    if (!gigId) {
      return NextResponse.json(
        {
          message: "Gig ID is required",
        },
        { status: 400 },
      )
    }

    // Find the gig
    const gig = await ProjectModel.findById(gigId)

    if (!gig) {
      return NextResponse.json(
        {
          message: "Gig not found",
        },
        { status: 404 },
      )
    }

    // Check if the user is the owner of the gig
    if (gig.createdBy !== user.email) {
      return NextResponse.json(
        {
          message: "Unauthorized: You can only update your own gigs",
        },
        { status: 403 },
      )
    }

    // Update the displayContactLinks field
    gig.displayContactLinks = displayContactLinks
    await gig.save()

    return NextResponse.json(
      {
        message: "Contact visibility updated successfully",
        gig,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating contact visibility:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
