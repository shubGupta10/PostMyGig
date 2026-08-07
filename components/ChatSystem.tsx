"use client"

import type React from "react"
import { useState, useEffect, useRef, type JSX } from "react"
import { Send, MessageCircle, Loader, AlertCircle, ChevronDown, ArrowLeft, CheckCheck } from "lucide-react"
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
  disconnectSocket,
  isConnected as socketIsConnected,
  getCurrentUserId,
  type ReceiveMessageData,
  type ChatHistoryData,
} from "@/lib/(socket)/socket"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getInitials } from "@/lib/helpers"
import { SidebarAutoCollapser } from "./chat/SidebarAutoCollapser"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Message {
  message: string
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
    location: string
  }
}

interface ChatSystemProps {
  projectId: string
  onBackToThreads?: () => void
}

export default function ChatSystem({ projectId, onBackToThreads }: ChatSystemProps): JSX.Element {
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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleScroll = (): void => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setShowScrollButton(!isAtBottom)
    }
  }

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
            sender: data.sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: false,
          },
        ])
      })

      onDisconnect(() => {
        setIsConnected(false)
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
      disconnectSocket()
    }
  }, [])

  const sendMessage = (): void => {
    if (!socketIsConnected() || !message.trim() || !posterUserId || !applyerUserId) return

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
      )
      setMessage("")
    } catch (error) {
      toast.error("Failed to send message")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
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
          <button
            onClick={() => (onBackToThreads ? onBackToThreads() : router.back())}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="size-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm border border-border shrink-0">
            {getInitials(chatPartnerName || "User")}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{chatPartnerName}</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary animate-pulse" : isConnecting ? "bg-yellow-500 animate-pulse" : "bg-destructive"}`} />
              <span>{isConnected ? "Online" : isConnecting ? "Connecting..." : "Disconnected"}</span>
            </div>
          </div>
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
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 shadow-xs space-y-1 ${
                  msg.isOwn
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs"
                    : "bg-secondary text-secondary-foreground rounded-2xl rounded-tl-xs border-2 border-border"
                }`}
              >
                <p className="text-sm leading-relaxed font-normal break-words">{msg.message}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] ${
                    msg.isOwn ? "text-primary-foreground/80" : "text-secondary-foreground/70"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isOwn && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-3 bg-card border-2 border-border text-foreground rounded-full shadow-lg hover:bg-secondary transition-colors z-10 cursor-pointer"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-card border-t border-border shrink-0">
        <div className="flex gap-2 sm:gap-3 items-center">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type a message...`}
            disabled={!isConnected}
            className="flex-1 h-10 px-4 bg-background border border-border rounded-xl"
          />
          <Button
            onClick={sendMessage}
            disabled={!isConnected || !message.trim()}
            className="h-10 px-4 bg-primary text-primary-foreground rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
