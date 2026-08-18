"use client"

import React, { useState } from "react"
import { MessageCircle, Search, Trash2, PanelLeftClose } from "lucide-react"
import type { ChatData } from "@/app/(pages)/(socket)/chat-history/types"
import { formatTimeStamp, getInitials } from "@/lib/helpers"
import ChatSystem from "@/components/ChatSystem"
import { SidebarAutoCollapser } from "./SidebarAutoCollapser"
import { deleteChat } from "@/app/(pages)/(socket)/chat-history/services/clientChatService"
import { useSession } from "next-auth/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MessageWorkspaceProps {
  initialChats: ChatData[]
  activeProjectId?: string
}

export function MessageWorkspace({ initialChats, activeProjectId }: MessageWorkspaceProps) {
  const { data: session } = useSession()
  const [chats, setChats] = useState<ChatData[]>(initialChats)
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    activeProjectId || (initialChats.length > 0 ? initialChats[0].gigId : undefined)
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileChat, setShowMobileChat] = useState<boolean>(!!activeProjectId)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [chatToDelete, setChatToDelete] = useState<{ id: string; gigId: string; name: string } | null>(null)

  const getChatPartner = (chat: ChatData) => {
    const isMe = chat.senderId === session?.user?.id || chat.senderEmail === session?.user?.email;
    const partnerName = isMe ? chat.receiverName : chat.senderName;
    const partnerEmail = isMe ? chat.receiverEmail : chat.senderEmail;
    return { partnerName, partnerEmail };
  };

  const filteredChats = chats.filter((chat) => {
    const { partnerName, partnerEmail } = getChatPartner(chat);
    return (
      partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partnerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Separate active huddles vs recent direct chats
  const huddleChats = filteredChats.filter((c) => !!c.gigId)
  const recentChats = filteredChats.filter((c) => !c.gigId)

  const handleSelectChat = (gigId: string) => {
    setSelectedProjectId(gigId)
    setShowMobileChat(true)
  }

  const confirmDeleteChat = async () => {
    if (!chatToDelete || !session?.user?.id) return
    const { gigId, id } = chatToDelete

    setDeletingId(id)
    setChatToDelete(null)

    const success = await deleteChat(gigId, session.user.id)
    setDeletingId(null)

    if (success) {
      setChats((prev) => prev.filter((c) => c._id !== id))
      if (selectedProjectId === gigId) {
        setSelectedProjectId(undefined)
      }
    }
  }

  const renderChatItem = (chat: ChatData) => {
    const isSelected = selectedProjectId === chat.gigId
    const isDeleting = deletingId === chat._id
    const { partnerName } = getChatPartner(chat)

    return (
      <div
        key={chat._id}
        onClick={() => handleSelectChat(chat.gigId)}
        className={`group w-full px-4 py-3 text-left flex items-center gap-3 transition-colors cursor-pointer relative ${isSelected
          ? "bg-secondary text-foreground font-semibold"
          : "hover:bg-muted text-card-foreground font-normal"
          }`}
      >
        <div className="size-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm border border-border shrink-0">
          {getInitials(partnerName || "User")}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {partnerName}
            </h4>
            <span className="text-xs text-muted-foreground font-normal shrink-0 group-hover:hidden">
              {formatTimeStamp(chat.timeStamp)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setChatToDelete({ id: chat._id, gigId: chat.gigId, name: partnerName })
              }}
              disabled={isDeleting}
              title="Delete chat"
              className="hidden group-hover:flex items-center justify-center p-1 rounded-md hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1 font-normal">
            {chat.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex w-full overflow-hidden">
      <SidebarAutoCollapser />

      {/* Left Column: Messages & Huddles Thread List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col shrink-0 transition-all duration-200 ${
          showMobileChat ? "hidden md:flex" : "flex"
        } ${isSidebarCollapsed ? "md:!hidden" : "md:flex"}`}
      >
        {/* Sidebar Top Bar */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-card shrink-0">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Messages & Huddles
          </p>
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Collapse conversation list"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border bg-card shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 z-10" />
            <Input
              type="text"
              placeholder="Search chats by title or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pl-9 bg-background border-border rounded-xl"
            />
          </div>
        </div>

        {/* Scrollable Collapsible Accordion Sections */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="m-4 bg-muted rounded-xl p-10 text-center border border-border">
              <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-semibold">No chats or huddles</p>
              <p className="text-muted-foreground text-sm mt-1">Your active conversations will appear here.</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={["huddles", "recent"]} className="w-full">
              {/* Section 1: PROJECT HUDDLES */}
              <AccordionItem value="huddles" className="border-b border-border">
                <AccordionTrigger className="px-4 py-3 hover:no-underline text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/40">
                  Project Huddles ({huddleChats.length})
                </AccordionTrigger>
                <AccordionContent className="pb-0 divide-y divide-border">
                  {huddleChats.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-muted-foreground font-normal">No active project huddles</p>
                  ) : (
                    huddleChats.map(renderChatItem)
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: RECENT CHATS */}
              <AccordionItem value="recent" className="border-b border-border">
                <AccordionTrigger className="px-4 py-3 hover:no-underline text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/40">
                  Recent Chats ({recentChats.length})
                </AccordionTrigger>
                <AccordionContent className="pb-0 divide-y divide-border">
                  {recentChats.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-muted-foreground font-normal">No recent direct chats</p>
                  ) : (
                    recentChats.map(renderChatItem)
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>

      {/* Right Column: Active Chat Feed Workspace */}
      <div
        className={`flex-1 flex flex-col bg-background ${
          showMobileChat ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedProjectId ? (
          <ChatSystem
            projectId={selectedProjectId}
            onBackToThreads={() => setShowMobileChat(false)}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-muted rounded-xl p-10 text-center border border-border max-w-sm w-full">
              <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-semibold">Message Workspace</p>
              <p className="text-muted-foreground text-sm mt-1">
                Select a conversation from the left sidebar to start messaging in real-time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog modal={false} open={!!chatToDelete} onOpenChange={(open) => !open && setChatToDelete(null)}>
        <DialogContent showCloseButton={false} className="bg-card border-2 border-border rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">
              Delete Conversation?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-normal">
              Are you sure you want to delete this chat with{" "}
              <span className="font-semibold text-foreground">{chatToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-semibold border-2 border-border cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={confirmDeleteChat}
              className="h-9 px-4 rounded-xl text-xs font-semibold bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity cursor-pointer border-transparent"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
