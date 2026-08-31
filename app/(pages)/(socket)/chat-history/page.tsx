import { fetchChatHistory } from "./services/chatService"
import { MessageWorkspace } from "@/modules/chat/components/MessageWorkspace"

export default async function ChatHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; chatType?: string }>
}) {
  const chatHistoryData = await fetchChatHistory()
  const params = await searchParams

  return (
    <div className="h-full bg-background w-full overflow-hidden">
      <MessageWorkspace
        initialChats={chatHistoryData}
        activeDMUserId={params.userId}
        activeChatType={(params.chatType as "GIG" | "DM") || undefined}
      />
    </div>
  )
}
