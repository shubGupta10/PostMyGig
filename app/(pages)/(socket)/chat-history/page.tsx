import { fetchChatHistory } from "./services/chatService"
import { ChatHistoryCard } from "@/components/chat/ChatHistoryCard"
import { MessageCircle } from "lucide-react"

export default async function ChatHistoryPage() {
  const chatHistoryData = await fetchChatHistory()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-6">Your Chats</h2>
        
        {chatHistoryData.length === 0 ? (
          <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden text-center py-16 px-8">
            <div className="size-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border">
              <MessageCircle className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">No Chats Yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Your conversations will appear here once you start chatting with other users.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chatHistoryData.map((chat) => (
              <ChatHistoryCard key={chat._id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}