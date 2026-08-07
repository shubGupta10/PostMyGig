import { fetchChatHistory } from "./services/chatService"
import { MessageWorkspace } from "@/components/chat/MessageWorkspace"

export default async function ChatHistoryPage() {
  const chatHistoryData = await fetchChatHistory()

  return (
    <div className="h-[calc(100vh-4rem)] bg-background w-full overflow-hidden">
      <MessageWorkspace initialChats={chatHistoryData} />
    </div>
  )
}
