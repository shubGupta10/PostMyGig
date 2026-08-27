"use client"

import type React from "react"
import { useState, useEffect, useRef, type JSX } from "react"
import { Send, MessageCircle, Loader, AlertCircle, ChevronDown, ArrowLeft, CheckCheck, Paperclip, FileText, ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { toast } from "sonner"
import {
  connectSocket,
  initUser,
  joinPrivateRoom,
  sendPrivateMessage,
  onReceiveMessage,
  onChatHistory,
  onDisconnect,
  offReceiveMessage,
  offChatHistory,
  offDisconnect,
  onUserPresence,
  offUserPresence,
  checkUserPresence,
  disconnectSocket,
  isConnected as socketIsConnected,
  getCurrentUserId,
  type ReceiveMessageData,
  type ChatHistoryData,
  ChatAttachmentData,
} from "@/modules/chat/services/socket"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getInitials } from "@/lib/helpers"
import { SidebarAutoCollapser } from "./SidebarAutoCollapser"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUploadThing } from "@/lib/uploadthing"
import { ChatAttachmentPreview } from "./ChatAttachmentPreview"
import { ChatImageModal } from "./ChatImageModal"

interface Message {
  message: string
  attachment?: ChatAttachmentData | null;
  sender: string
  timestamp: string
  isOwn: boolean
}

interface UserData {
  posterData: {
    _id: string
    name: string
    email: string
    bio: string
    profilePhoto: string
    role: string
    skills: string[]
    location: string
  }
  applyerData: {
    _id: string
    name: string
    email: string
    bio: string
    profilePhoto: string
    role: string
    skills: string[]
    location: string,
  }
  projectData: {
    title: string;
    status: string;
    budget: string;
    description: string;
    skillsRequired: string[];
    createdAt: string;
  };
}

interface ChatSystemProps {
  projectId: string
  onBackToThreads?: () => void
  onToggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export default function ChatSystem({
  projectId,
  onBackToThreads,
  onToggleSidebar,
  isSidebarCollapsed = false,
}: ChatSystemProps): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>("")
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [posterUserId, setPosterUserId] = useState<string>("")
  const [applyerUserId, setApplyerUserId] = useState<string>("")
  const [currentUserRole, setCurrentUserRole] = useState<"poster" | "applyer" | "">("")
  const [chatPartnerName, setChatPartnerName] = useState<string>("")
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false)
  const [historyLoaded, setHistoryLoaded] = useState<boolean>(false)
  const [isPartnerOnline, setIsPartnerOnline] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<UserData["projectData"] | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stagedFile, setStagedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedImageModal, setSelectedImageModal] = useState<{ url: string; name?: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("chatAttachment")

  const stageSelectedFile = (file: File) => {
    const isImage = file.type.startsWith("image/")
    const isPdf = file.type === "application/pdf"

    if (!isImage && !isPdf) {
      toast.error("Only images (PNG, JPG, WEBP) and PDF files are supported")
      return
    }

    // Max 2MB for images
    if (isImage && file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be under 2MB")
      return
    }

    // Max 4MB for PDFs
    if (isPdf && file.size > 4 * 1024 * 1024) {
      toast.error("PDF size must be under 4MB")
      return
    }

    setStagedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }


  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1 || items[i].type === "application/pdf") {
        const file = items[i].getAsFile()
        if (file) {
          stageSelectedFile(file)
          e.preventDefault()
          break
        }
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = (behavior: ScrollBehavior = "smooth"): void => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  };

  const handleScroll = (): void => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setShowScrollButton(!isAtBottom)
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages]);


  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated" || !session?.user?.id) {
      setIsLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        setError("")

        const response = await fetch("/api/socket/fetch-data-of-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data: UserData = await response.json()
        setUserData(data)
        setProjectData(data.projectData);

        const posterId = data.posterData._id
        const applyerId = data.applyerData._id

        setPosterUserId(posterId)
        setApplyerUserId(applyerId)

        const sessionUserId = session?.user?.id || ""
        let currentUserId, targetUserId, partnerName
        let userRole: "poster" | "applyer"

        if (sessionUserId === posterId) {
          currentUserId = posterId
          targetUserId = applyerId
          partnerName = data.applyerData.name
          userRole = "poster"
        } else if (sessionUserId === applyerId) {
          currentUserId = applyerId
          targetUserId = posterId
          partnerName = data.posterData.name
          userRole = "applyer"
        } else {
          throw new Error("User not authorized for this chat")
        }

        setCurrentUserRole(userRole)
        setChatPartnerName(partnerName)

        await initializeSocketConnection(currentUserId, targetUserId)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize chat")
        toast.error("Failed to initialize chat")
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId && session?.user?.id) {
      fetchUserData()
    }
  }, [projectId, session?.user?.id, status])

  const initializeSocketConnection = async (userId: string, targetId: string) => {
    try {
      setIsConnecting(true)

      await connectSocket()
      initUser(userId)
      joinPrivateRoom(targetId)
      setIsConnected(true)

      onChatHistory((historyData: ChatHistoryData[]) => {
        const formattedMessages: Message[] = historyData.map((chat) => ({
          message: chat.message,
          attachment: chat.attachment || null,
          sender: chat.senderId,
          timestamp: new Date(chat.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: chat.senderId === userId,
        }))

        setMessages(formattedMessages)
        setHistoryLoaded(true)

        setTimeout(() => {
          scrollToBottom()
        }, 100)
      })

      onReceiveMessage((data: ReceiveMessageData) => {
        setMessages((prev) => [
          ...prev,
          {
            message: data.message,
            attachment: data.attachment || null,
            sender: data.sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: false,
          },
        ]);
        setTimeout(() => scrollToBottom("smooth"), 50);
      });


      onUserPresence((presenceData) => {
        if (presenceData.userId === targetId) {
          setIsPartnerOnline(presenceData.isOnline)
        }
      })

      checkUserPresence(targetId)

      onDisconnect(() => {
        setIsConnected(false)
        setIsPartnerOnline(false)
      })
    } catch (error) {
      setError("Failed to connect to chat server")
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    return () => {
      offReceiveMessage()
      offChatHistory()
      offDisconnect()
      offUserPresence()
      disconnectSocket()
    }
  }, [])

  const sendMessage = async (): Promise<void> => {
    if (!socketIsConnected() || (!message.trim() && !stagedFile) || !posterUserId || !applyerUserId || isUploading) return

    let uploadedAttachment: ChatAttachmentData | null = null;

    if (stagedFile) {
      try {
        const res = await startUpload([stagedFile])
        if (res && res[0]) {
          uploadedAttachment = {
            url: res[0].ufsUrl || res[0].url,
            fileType: stagedFile.type.startsWith("image/") ? "image" : "pdf",
            fileName: stagedFile.name,
            fileSize: stagedFile.size,
            fileKey: res[0].key,
          }
        }
      } catch (uploadErr: any) {
        console.error("UploadThing error:", uploadErr)
        toast.error(uploadErr?.message || "Failed to upload attachment")
        return
      }

    }

    const currentUserId = getCurrentUserId()
    const targetUserId = currentUserId === posterUserId ? applyerUserId : posterUserId

    let senderName: string, senderEmail: string, receiverName: string, receiverEmail: string

    if (currentUserRole === "poster") {
      senderName = userData?.posterData.name as string
      senderEmail = userData?.posterData.email as string
      receiverName = userData?.applyerData.name as string
      receiverEmail = userData?.applyerData.email as string
    } else {
      senderName = userData?.applyerData.name as string
      senderEmail = userData?.applyerData.email as string
      receiverName = userData?.posterData.name as string
      receiverEmail = userData?.posterData.email as string
    }

    const messageData: Message = {
      message: message.trim(),
      attachment: uploadedAttachment,
      sender: currentUserId || "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    }

    setMessages((prev) => [...prev, messageData])
    setTimeout(scrollToBottom, 50)

    try {
      sendPrivateMessage(
        targetUserId,
        message.trim(),
        projectId,
        senderName,
        senderEmail,
        receiverName,
        receiverEmail,
        uploadedAttachment
      )
      setMessage("")
      setStagedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      toast.error("Failed to send message")
    }
  }


  if (status === "loading" || isLoading) {
    return (
      <div className="h-full bg-background flex items-center justify-center p-4">
        <SidebarAutoCollapser />
        <div className="bg-card rounded-2xl p-8 border-2 border-border text-center max-w-sm w-full space-y-4 shadow-xs">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm font-semibold text-foreground">Connecting to Chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background flex flex-col flex-1 overflow-hidden">
      <SidebarAutoCollapser />

      {/* WhatsApp Web Right Header */}
      <div className="h-16 px-4 bg-card border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            onClick={() => (onBackToThreads ? onBackToThreads() : router.back())}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer md:hidden"
            title="Back to conversation list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Desktop Toggle Conversation List (Only shown when sidebar is collapsed) */}
          {onToggleSidebar && isSidebarCollapsed && (
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer mr-1"
              title="Show conversation list"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}

          <div className="size-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm border border-border shrink-0">
            {getInitials(chatPartnerName || "User")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">{chatPartnerName}</h2>
              {projectData?.title && (
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md hidden sm:inline-block border border-border/50">
                  💬 {projectData.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
              <span className={`w-2 h-2 rounded-full ${isPartnerOnline ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : isConnecting ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className={isPartnerOnline ? "text-emerald-500 font-medium" : "text-muted-foreground"}>
                {isPartnerOnline ? "Online" : isConnecting ? "Connecting..." : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* --- MOVED TO USERGIGCARD --- */}
        <div className="flex items-center gap-3">
          {projectData && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-secondary hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors" title="Project Info">
                  <AlertCircle className="w-5 h-5" />
                  <span className="sr-only">Project Info</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
                <SheetHeader className="mb-6 space-y-6 mt-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-primary text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wider">
                      {projectData.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <SheetTitle className="text-xl font-bold leading-tight">
                    {projectData.title}
                  </SheetTitle>
                  <p className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                    Budget: <span className="text-primary">{projectData.budget}</span>
                  </p>
                </SheetHeader>

                <div className="space-y-6">
                  {projectData.skillsRequired.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Skills Required
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {projectData.skillsRequired.map((skill) => (
                          <span key={skill} className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      Gig Description
                    </h4>
                    <div className="bg-muted rounded-xl p-4 border border-border">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {projectData.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-background relative"
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto text-secondary-foreground shadow-xs">
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">Start the Conversation</p>
            <p className="text-xs text-muted-foreground">Messages are connected in real-time.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const hasImage = msg.attachment?.fileType === "image"
            const hasPdf = msg.attachment?.fileType === "pdf"
            const hasText = Boolean(msg.message && msg.message.trim().length > 0)
            const isMediaOnly = hasImage && !hasText

            return (
              <div
                key={idx}
                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-150`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[65%] shadow-xs transition-all ${msg.isOwn
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs"
                    : "bg-secondary text-secondary-foreground rounded-2xl rounded-tl-xs border border-border"
                    } ${isMediaOnly ? "p-1 overflow-hidden" : "p-3 space-y-2"}`}
                >
                  {/* Image Attachment */}
                  {hasImage && (
                    <div
                      className={`relative rounded-xl overflow-hidden cursor-pointer max-w-sm group ${isMediaOnly ? "" : "mb-2"
                        }`}
                      onClick={() =>
                        setSelectedImageModal({
                          url: msg.attachment!.url,
                          name: msg.attachment!.fileName,
                        })
                      }
                    >
                      <img
                        src={msg.attachment!.url}
                        alt={msg.attachment!.fileName || "Image"}
                        className="w-full h-auto max-h-72 object-cover rounded-xl transition-transform duration-200 group-hover:scale-[1.01]"
                      />

                      {/* Translucent Overlay Timestamp for Media-Only Bubbles */}
                      {isMediaOnly && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/65 text-white/90 backdrop-blur-xs text-[10px] font-medium flex items-center gap-1 shadow-xs pointer-events-none">
                          <span>{msg.timestamp}</span>
                          {msg.isOwn && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PDF Attachment */}
                  {hasPdf && (
                    <div
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 border ${msg.isOwn
                        ? "bg-primary-foreground/10 border-primary-foreground/20"
                        : "bg-background border-border"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate text-xs">
                          <p className="font-semibold truncate">{msg.attachment!.fileName}</p>
                          <p className="text-[10px] opacity-75">
                            {msg.attachment!.fileSize ? (msg.attachment!.fileSize / (1024 * 1024)).toFixed(2) : "0"} MB • PDF
                          </p>
                        </div>
                      </div>
                      <a
                        href={msg.attachment!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors shrink-0"
                        title="Open PDF"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Message Text Caption */}
                  {hasText && (
                    <p className="text-sm leading-relaxed font-normal break-words whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  )}

                  {/* Message Timestamp (Only shown below if there is text or PDF) */}
                  {!isMediaOnly && (
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] pt-0.5 ${msg.isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isOwn && <CheckCheck className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />

        {showScrollButton && (
          <button
            onClick={() => scrollToBottom()}
            className="fixed bottom-24 right-8 p-3 bg-card border-2 border-border text-foreground rounded-full shadow-lg hover:bg-secondary transition-colors z-10 cursor-pointer"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expanded Modern Input Box */}
      <div className="p-3 sm:p-4 bg-card border-t border-border shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) stageSelectedFile(e.target.files[0])
          }}
          accept="image/*,application/pdf"
          className="hidden"
        />

        <div className="bg-background border border-border focus-within:border-primary/60 rounded-2xl p-3 transition-all shadow-xs flex flex-col gap-2.5">
          {/* Staged File Preview if any */}
          {stagedFile && (
            <ChatAttachmentPreview
              file={stagedFile}
              previewUrl={previewUrl}
              isUploading={isUploading}
              onRemove={() => {
                setStagedFile(null)
                setPreviewUrl(null)
              }}
            />
          )}

          {/* Multi-line Message Textarea */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={stagedFile ? "Add a caption (optional)..." : "Type a message..."}
            disabled={!isConnected || isUploading}
            className="w-full bg-transparent border-0 resize-none focus:outline-hidden focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground min-h-[44px] max-h-36 leading-relaxed p-0"
          />

          {/* Bottom Controls Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!isConnected || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-colors"
                title="Attach image or PDF"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={sendMessage}
              disabled={!isConnected || (!message.trim() && !stagedFile) || isUploading}
              className="h-8 px-4 bg-primary text-primary-foreground rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:opacity-95 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </Button>
          </div>
        </div>
      </div>

      <ChatImageModal
        imageUrl={selectedImageModal?.url || null}
        fileName={selectedImageModal?.name}
        isOpen={Boolean(selectedImageModal)}
        onClose={() => setSelectedImageModal(null)}
      />
    </div>
  )
}
