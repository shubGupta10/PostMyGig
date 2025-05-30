"use client"

import type React from "react"
import { useState, useEffect, useRef, type JSX } from "react"
import { Send, MessageCircle, Loader, AlertCircle, ChevronDown } from "lucide-react"
import { toast } from "sonner"
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
      toast.loading("Connecting to chat...", { id: "chat-connection" })

      await connectSocket()
      initUser(userId)
      joinPrivateRoom(targetId)
      setIsConnected(true)

      toast.success("Connected to chat", { id: "chat-connection" })

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
        toast.success("New message received")
      })

      onDisconnect(() => {
        setIsConnected(false)
        toast.error("Disconnected from chat server")
      })
    } catch (error) {
      setError("Failed to connect to chat server")
      setIsConnected(false)
      toast.error("Failed to connect to chat server", { id: "chat-connection" })
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
      setError("Failed to send message")
      toast.error("Failed to send message")
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Initializing Chat</h2>
          <p className="text-gray-600 text-lg leading-relaxed">Setting up your private conversation...</p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-red-200 text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Unauthorized Access</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">You need to be logged in to access this chat.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-8 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all duration-200 font-bold text-lg shadow-lg hover:scale-105 active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-red-200 text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Chat Error</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-200 font-bold text-lg shadow-lg hover:scale-105 active:scale-95"
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto h-screen max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Enhanced Header */}
        <div className={`bg-white border-b ${roleColors.border} p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${roleColors.bg} rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white`}>
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{chatPartnerName}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${getConnectionDot()} animate-pulse`}></div>
                  <span className={`font-semibold ${getConnectionStatus().color}`}>{getConnectionStatus().text}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <span className={`font-medium ${roleColors.text} capitalize px-2 py-1 rounded-md bg-gray-100`}>{currentUserRole}</span>
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 ${roleColors.light} ${roleColors.border} border-2 rounded-2xl shadow-sm`}>
              <span className={`text-sm font-bold ${roleColors.text} tracking-wide`}>PROJECT CHAT</span>
            </div>
          </div>
        </div>

        {/* Enhanced Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white relative" ref={messagesContainerRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">Start Your Conversation</h3>
                <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                  Begin discussing your project with <span className="font-semibold text-gray-700">{chatPartnerName}</span>
                </p>
              </div>
            ) : (
              messages.map((msg: Message, index: number) => (
                <div key={index} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"} max-w-sm lg:max-w-md`}>
                    <div
                      className={`px-5 py-4 rounded-3xl shadow-md transition-all duration-200 hover:shadow-lg ${
                        msg.isOwn
                          ? `${roleColors.bg} text-white rounded-br-lg`
                          : `${partnerColors.bg} ${partnerColors.text} border-2 ${partnerColors.border} rounded-bl-lg`
                      }`}
                    >
                      <div className="break-words leading-relaxed font-medium">{msg.message}</div>
                    </div>
                    <div className={`text-xs mt-2 px-2 font-medium ${msg.isOwn ? "text-gray-500" : "text-gray-400"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Scroll Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className={`fixed bottom-32 right-8 w-14 h-14 ${roleColors.bg} ${roleColors.hover} text-white rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 z-10 hover:scale-110 ring-4 ring-white`}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Enhanced Input Area */}
        <div className={`bg-white border-t-2 ${roleColors.border} p-6 backdrop-blur-sm`}>
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${chatPartnerName}...`}
                disabled={!isConnected || isConnecting || isLoading}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 text-gray-800 placeholder-gray-500 font-medium text-base transition-all duration-200 shadow-sm"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className={`w-2 h-2 rounded-full ${getConnectionDot()}`}></div>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!isConnected || !message.trim() || isConnecting || isLoading}
              className={`px-6 py-4 ${roleColors.bg} ${roleColors.hover} text-white rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg font-bold text-base hover:scale-105 active:scale-95`}
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          {/* Typing Indicator Area */}
          <div className="mt-3 h-4 flex items-center">
            <div className={`text-xs ${roleColors.text} font-medium opacity-0`}>
              {chatPartnerName} is typing...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}