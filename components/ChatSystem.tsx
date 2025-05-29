"use client"

import type React from "react"

import { useState, useEffect, useRef, type JSX } from "react"
import { Send, MessageCircle, Loader, AlertCircle, ChevronDown } from "lucide-react"
import {
  connectSocket,
  initUser,
  joinPrivateRoom,
  sendPrivateMessage,
  onReceiveMessage,
  onDisconnect,
  offReceiveMessage,
  offDisconnect,
  disconnectSocket,
  isConnected as socketIsConnected,
  getCurrentUserId,
  type ReceiveMessageData,
} from "@/lib/(socket)/socket"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

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
}

export default function ChatSystem({ projectId }: ChatSystemProps): JSX.Element {
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
        console.error("Error fetching user data:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize chat")
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

      onReceiveMessage((data: ReceiveMessageData) => {
        setMessages((prev) => [
          ...prev,
          {
            message: data.message,
            sender: data.sender,
            timestamp: new Date().toLocaleTimeString(),
            isOwn: false,
          },
        ])
      })

      onDisconnect(() => {
        setIsConnected(false)
        console.log("Disconnected from server")
      })
    } catch (error) {
      console.error("Failed to connect:", error)
      setError("Failed to connect to chat server")
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    return () => {
      offReceiveMessage()
      offDisconnect()
      disconnectSocket()
    }
  }, [])

  const sendMessage = (): void => {
    if (!socketIsConnected() || !message.trim() || !posterUserId || !applyerUserId) return

    const currentUserId = getCurrentUserId()
    const targetUserId = currentUserId === posterUserId ? applyerUserId : posterUserId

    const messageData: Message = {
      message: message.trim(),
      sender: currentUserId || "",
      timestamp: new Date().toLocaleTimeString(),
      isOwn: true,
    }

    setMessages((prev) => [...prev, messageData])

    try {
      sendPrivateMessage(targetUserId, message.trim())
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      setError("Failed to send message")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }

  const getConnectionStatus = (): { text: string; color: string } => {
    if (isConnecting || isLoading) return { text: "Connecting...", color: "text-amber-600" }
    if (error) return { text: "Error", color: "text-red-600" }
    if (isConnected) return { text: "Connected", color: "text-emerald-600" }
    return { text: "Disconnected", color: "text-red-600" }
  }

  const getConnectionDot = (): string => {
    if (isConnecting || isLoading) return "bg-amber-500"
    if (error) return "bg-red-500"
    if (isConnected) return "bg-emerald-500"
    return "bg-red-500"
  }

  const getRoleColors = () => {
    return currentUserRole === "poster"
      ? {
          bg: "bg-blue-500",
          hover: "hover:bg-blue-600",
          text: "text-blue-600",
          light: "bg-blue-50",
          border: "border-blue-200",
        }
      : {
          bg: "bg-green-500",
          hover: "hover:bg-green-600",
          text: "text-green-600",
          light: "bg-green-50",
          border: "border-green-200",
        }
  }

  const getPartnerColors = () => {
    return currentUserRole === "poster"
      ? { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }
      : { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Initializing Chat</h2>
          <p className="text-slate-600">Setting up your private conversation...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session?.user?.id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Unauthorized Access</h2>
          <p className="text-slate-600 mb-6">You need to be logged in to access this chat.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Chat Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const roleColors = getRoleColors()
  const partnerColors = getPartnerColors()

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl h-screen max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`bg-white border-b-2 ${roleColors.border} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${roleColors.bg} rounded-full flex items-center justify-center shadow-md`}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{chatPartnerName}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getConnectionDot()}`}></div>
                  <span className={`font-medium ${getConnectionStatus().color}`}>{getConnectionStatus().text}</span>
                  <span className="text-slate-400">•</span>
                  <span className={`font-medium ${roleColors.text} capitalize`}>{currentUserRole}</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 ${roleColors.light} ${roleColors.border} border rounded-full`}>
              <span className={`text-xs font-medium ${roleColors.text}`}>Project Chat</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative" ref={messagesContainerRef}>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Start Your Conversation</h3>
                <p className="text-slate-500 text-sm">Begin chatting with {chatPartnerName} about your project</p>
              </div>
            ) : (
              messages.map((msg: Message, index: number) => (
                <div key={index} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      msg.isOwn
                        ? `${roleColors.bg} text-white`
                        : `${partnerColors.bg} ${partnerColors.text} border ${partnerColors.border}`
                    }`}
                  >
                    <div className="break-words">{msg.message}</div>
                    <div className={`text-xs mt-1 ${msg.isOwn ? "text-white/70" : "text-slate-500"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className={`fixed bottom-24 right-8 w-12 h-12 ${roleColors.bg} ${roleColors.hover} text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-10`}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Message Input */}
        <div className={`bg-white border-t-2 ${roleColors.border} p-4`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${chatPartnerName}...`}
              disabled={!isConnected || isConnecting || isLoading}
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-50 text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !message.trim() || isConnecting || isLoading}
              className={`px-5 py-3 ${roleColors.bg} ${roleColors.hover} text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md font-medium`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
