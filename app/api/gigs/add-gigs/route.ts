import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { title, description, skillsRequired, contact, expiresAt } = await req.json();

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!title || !description || !skillsRequired || !contact || !expiresAt) {
            return NextResponse.json(
                { message: "Please fill all details" },
                { status: 400 }
            );
        }

        const newGig = new ProjectModel({
            title,
            description,
            createdBy: session.user.id,
            skillsRequired,
            contact,
            status: "active",
            expiresAt
        });

        await newGig.save();

        return NextResponse.json(
            { message: "Gig created successfully", gig: newGig },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating gig:", error);
        return NextResponse.json(
            { message: "Failed to create gig" },
            { status: 500 }
        );
    }
}
