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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Loader className="w-10 h-10 animate-spin text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Loading Chats</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">Fetching your conversations...</p>
                    <div className="mt-6 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Error</h2>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
                    <button
                        onClick={fetchChatHistoryData}
                        className="px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-200 font-bold text-lg shadow-lg hover:scale-105 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Chats History</h1>
                            <p className="text-gray-600 text-lg mt-1">
                                {chatHistoryData.length} conversation{chatHistoryData.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat List */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    {chatHistoryData.length === 0 ? (
                        <div className="text-center py-16 px-8">
                            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <MessageCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-3">No Chats Yet</h3>
                            <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                                Your conversations will appear here once you start chatting with other users.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {chatHistoryData.map((chat) => (
                                <div
                                    key={chat._id}
                                    onClick={() => handleChatClick(chat)}
                                    className="p-8 hover:bg-gray-50 transition-all duration-200 cursor-pointer group border-l-4 border-transparent hover:border-green-500"
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white group-hover:ring-green-200 transition-all duration-200 group-hover:scale-105">
                                            <span className="text-white font-bold text-xl">
                                                {getInitials(chat.receiverName)}
                                            </span>
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors duration-200">
                                                    {chat.receiverName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        {formatTimeStamp(chat.timeStamp)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-4">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 text-base font-medium truncate">
                                                    {chat.receiverEmail}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-700 text-base leading-relaxed truncate max-w-lg">
                                                    {chat.message}
                                                </p>
                                                <button
                                                    onClick={() => router.push(`/chat?projectId=${chat.gigId}`)}
                                                    className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-medium text-base shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
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
                            className="px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-200 font-medium shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
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