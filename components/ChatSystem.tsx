"use client"

import { useState, useEffect, useRef, JSX } from 'react';
import { Send, Users } from 'lucide-react';
import {
    connectSocket,
    joinRoom as socketJoinRoom,
    sendMessage as socketSendMessage,
    onReceiveMessage,
    onDisconnect,
    offReceiveMessage,
    offDisconnect,
    disconnectSocket,
    isConnected as socketIsConnected,
    MessageData,
    ReceiveMessageData
} from '@/lib/(socket)/socket';
import { useSession } from 'next-auth/react';

interface Message {
    message: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
}

export default function ChatSystem(): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [sender, setSender] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Move the session effect before the socket initialization
    useEffect(() => {
        if (session?.user?.name) {
            setSender(session.user.name);
        }
    }, [session]);

    useEffect(() => {
        const initSocket = async (): Promise<void> => {
            try {
                setIsConnecting(true);
                await connectSocket();
                setIsConnected(true);

                onReceiveMessage((data: ReceiveMessageData) => {
                    setMessages(prev => [...prev, {
                        message: data.message,
                        sender: data.sender,
                        timestamp: new Date().toLocaleTimeString(),
                        isOwn: false
                    }]);
                });

                onDisconnect(() => {
                    setIsConnected(false);
                    console.log('Disconnected from server');
                });

            } catch (error) {
                console.error('Failed to connect:', error);
                setIsConnected(false);
            } finally {
                setIsConnecting(false);
            }
        };

        initSocket();

        return () => {
            offReceiveMessage();
            offDisconnect();
            disconnectSocket();
        };
    }, []);

    const joinRoom = (): void => {
        if (!socketIsConnected() || !roomId.trim() || !sender.trim()) return;

        try {
            socketJoinRoom(roomId);
            setIsJoined(true);
            setMessages([]);
        } catch (error) {
            console.error('Failed to join room:', error);
        }
    };

    const sendMessage = (): void => {
        if (!socketIsConnected() || !message.trim() || !isJoined) return;

        const messageData: Message = {
            message: message.trim(),
            sender,
            timestamp: new Date().toLocaleTimeString(),
            isOwn: true
        };

        setMessages(prev => [...prev, messageData]);

        try {
            const socketMessage: MessageData = {
                roomId,
                message: message.trim(),
                sender
            };

            socketSendMessage(socketMessage);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isJoined) {
                joinRoom();
            } else {
                sendMessage();
            }
        }
    };

    const leaveRoom = (): void => {
        setIsJoined(false);
        setMessages([]);
        setRoomId('');
    };

    const getConnectionStatus = (): { text: string; color: string } => {
        if (isConnecting) return { text: 'Connecting...', color: 'text-yellow-600' };
        if (isConnected) return { text: 'Connected', color: 'text-green-600' };
        return { text: 'Disconnected', color: 'text-red-600' };
    };

    const getConnectionDot = (): string => {
        if (isConnecting) return 'bg-yellow-500';
        if (isConnected) return 'bg-green-500';
        return 'bg-red-500';
    };

    if (!isJoined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
                <div className=" w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Chat Room</h1>
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${getConnectionDot()}`}></div>
                                <span className={getConnectionStatus().color}>
                                    {getConnectionStatus().text}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={sender || ''}  // Always provide a string value
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSender(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    readOnly={!!session?.user?.name} // Make read-only if we have session name
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Room ID</label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter room ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                onClick={joinRoom}
                                disabled={!isConnected || !roomId.trim() || !sender.trim() || isConnecting}
                                className="w-full bg-gradient-to-r from-green-500 to-green-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isConnecting ? 'Connecting...' : 'Join Room'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="max-w-7xl mx-auto h-screen max-h-screen flex flex-col">
                <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">Room: {roomId}</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${getConnectionDot()}`}></div>
                                <span className={getConnectionStatus().color}>
                                    {getConnectionStatus().text}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={leaveRoom}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Leave Room
                    </button>
                </div>

                <div className="flex-1 bg-white border-x border-gray-200 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg: Message, index: number) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.isOwn
                                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {!msg.isOwn && (
                                            <div className="text-xs font-medium mb-1 text-gray-600">
                                                {msg.sender}
                                            </div>
                                        )}
                                        <div className="break-words">{msg.message}</div>
                                        <div className={`text-xs mt-1 ${msg.isOwn ? 'text-green-100' : 'text-gray-500'
                                            }`}>
                                            {msg.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 p-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            disabled={!isConnected || !roomId.trim() || isConnecting}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!isConnected || !message.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}