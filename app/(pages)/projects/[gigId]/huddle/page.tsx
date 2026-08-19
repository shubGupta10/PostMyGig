import React from "react"
import { ConnectoDatabase } from "@/lib/db"
import ProjectModel from "@/modules/gigs/models/ProjectModel"
import userModel from "@/modules/users/models/UserModel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchChatHistory } from "@/app/(pages)/(socket)/chat-history/services/chatService"
import { MessageWorkspace } from "@/modules/chat/components/MessageWorkspace"

interface HuddlePageProps {
    params: Promise<{
        gigId: string
    }>
}

export const metadata = {
    title: "Project Huddle | PostMyGig",
    description: "Collaborate and chat in real-time on your accepted gig project",
}

export default async function ProjectHuddlePage({ params }: HuddlePageProps) {
    const { gigId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect("/auth/login")
    }

    await ConnectoDatabase()

    // Fetch project details
    const projectDoc = await ProjectModel.findById(gigId).lean()
    if (!projectDoc) {
        redirect("/dashboard")
    }

    const project = projectDoc as any
    const userEmail = session.user.email
    const isClient = project.createdBy === userEmail
    const isAcceptedFreelancer = project.AcceptedFreelancerEmail === userEmail

    // Security Check: Only Client or Accepted Freelancer can access Huddle
    if (!isClient && !isAcceptedFreelancer) {
        redirect("/dashboard")
    }

    // Fetch partner details (if Client -> fetch Freelancer, if Freelancer -> fetch Client)
    const partnerEmail = isClient ? project.AcceptedFreelancerEmail : project.createdBy
    const partnerUser = partnerEmail
        ? await userModel.findOne({ email: partnerEmail }).lean()
        : null

    const partnerName = partnerUser?.name || partnerEmail || "Project Partner"
    const partnerContact = isClient ? (partnerUser as any)?.contact : project.contact

    const chatHistoryData = await fetchChatHistory()

    return (
        <div className="h-full bg-background w-full overflow-hidden">
            <MessageWorkspace initialChats={chatHistoryData} activeProjectId={gigId} />
        </div>
    )
}
