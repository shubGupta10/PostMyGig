"use client"

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { MessageCircle, Mail, Clock, User, Loader, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatData {
    _id: string
    senderId: string
    receiverId: string
    senderName: string
    senderEmail: string
    receiverName: string
    receiverEmail: string
    gigId: string
    message: string
    timeStamp: string
    __v: number
}

function ChatHistoryList() {
    const BackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!
    const { data } = useSession()
    const [chatHistoryData, setChatHistoryData] = useState<ChatData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter();

    const fetchChatHistoryData = async () => {
        try {
            setIsLoading(true)
            setError('')

            const response = await fetch(`${BackendUrl}/api/v1/chat/fetch-all-chat-list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentUserId: data?.user.id })
            })

            if (!response.ok) {
                throw new Error('Failed to fetch chat history')
            }

            const responseData = await response.json()
            setChatHistoryData(responseData.chat || [])
            console.log(responseData.chat)

        } catch (error) {
            console.error("Failed to fetch chat history:", error)
            setError('Failed to load chat history')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (data?.user.id) {
            fetchChatHistoryData()
        }
    }, [data?.user.id])

    const formatTimeStamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString([], { weekday: 'short' })
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase()
    }

    const handleChatClick = (chat: ChatData) => {
        // Navigate to chat - you can implement routing here
        console.log('Navigate to chat with:', chat.receiverName, 'Project ID:', chat.gigId)
        // Example: router.push(`/chat/${chat.gigId}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-card rounded-3xl shadow-2xl p-10 border border-border text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Loader className="w-10 h-10 animate-spin text-accent-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-4 tracking-tight">Loading Chats</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">Fetching your conversations...</p>
                    <div className="mt-6 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-card rounded-3xl shadow-2xl p-10 border border-destructive text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <AlertCircle className="w-10 h-10 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-4 tracking-tight">Error</h2>
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{error}</p>
                    <button
                        onClick={fetchChatHistoryData}
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-200 font-bold text-lg shadow-lg hover:scale-105 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-card rounded-3xl shadow-xl p-8 mb-6 border border-border">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-card">
                            <MessageCircle className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-card-foreground tracking-tight">Your Chats History</h1>
                            <p className="text-muted-foreground text-lg mt-1">
                                {chatHistoryData.length} conversation{chatHistoryData.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat List */}
                <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
                    {chatHistoryData.length === 0 ? (
                        <div className="text-center py-16 px-8">
                            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <MessageCircle className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-3">No Chats Yet</h3>
                            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                                Your conversations will appear here once you start chatting with other users.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {chatHistoryData.map((chat) => (
                                <div
                                    key={chat._id}
                                    onClick={() => handleChatClick(chat)}
                                    className="p-8 hover:bg-muted/50 transition-all duration-200 cursor-pointer group border-l-4 border-transparent hover:border-primary"
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-card group-hover:ring-primary/20 transition-all duration-200 group-hover:scale-105">
                                            <span className="text-secondary-foreground font-bold text-xl">
                                                {getInitials(chat.receiverName)}
                                            </span>
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-bold text-card-foreground truncate group-hover:text-primary transition-colors duration-200">
                                                    {chat.receiverName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        {formatTimeStamp(chat.timeStamp)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-4">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground text-base font-medium truncate">
                                                    {chat.receiverEmail}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-card-foreground text-base leading-relaxed truncate max-w-lg">
                                                    {chat.message}
                                                </p>
                                                <button
                                                    onClick={() => router.push(`/chat?projectId=${chat.gigId}`)}
                                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium text-base shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>Open Chat</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {chatHistoryData.length > 0 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={fetchChatHistoryData}
                            className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Refresh Chats</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatHistoryList