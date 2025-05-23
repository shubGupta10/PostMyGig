import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";

interface ContactInfo {
    email?: string;
    whatsapp?: string;
    x?: string;
}

interface RequestBody {
    title: string;
    description: string;
    skillsRequired: string[];
    contact: ContactInfo;
    expiresAt: string;
    budget: string;
}

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const { title, description, skillsRequired, contact, expiresAt, budget }: RequestBody = await req.json();

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validation
        if (!title || !description || !skillsRequired || !contact || !expiresAt || !budget) {
            return NextResponse.json(
                { message: "Please fill all details" },
                { status: 400 }
            );
        }

        // Validate skillsRequired is an array
        if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
            return NextResponse.json(
                { message: "Skills required must be a non-empty array" },
                { status: 400 }
            );
        }

        const cleanContact: ContactInfo = {};
        if (contact.email && contact.email.trim()) {
            cleanContact.email = contact.email.trim();
        }
        if (contact.whatsapp && contact.whatsapp.trim()) {
            cleanContact.whatsapp = contact.whatsapp.trim();
        }
        if (contact.x && contact.x.trim()) {
            cleanContact.x = contact.x.trim();
        }

        const newGig = new ProjectModel({
            title: title.trim(),
            description: description.trim(),
            createdBy: session.user.id,
            skillsRequired: skillsRequired.map(skill => skill.trim()).filter(skill => skill.length > 0),
            contact: cleanContact,
            status: "active",
            expiresAt: new Date(expiresAt),
            budget: budget.trim(),
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