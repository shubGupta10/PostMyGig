import { fetchChatHistory } from "./services/chatService"
import { MessageWorkspace } from "@/modules/chat/components/MessageWorkspace"

export default async function ChatHistoryPage() {
  const chatHistoryData = await fetchChatHistory()

  return (
    <div className="h-full bg-background w-full overflow-hidden">
      <MessageWorkspace initialChats={chatHistoryData} />
    </div>
  )
}
