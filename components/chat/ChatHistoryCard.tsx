import { Clock, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { ChatData } from "@/app/(pages)/(socket)/chat-history/types"

export function ChatHistoryCard({ chat }: { chat: ChatData }) {
  const formatTimeStamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="bg-card text-card-foreground rounded-2xl border-2 border-border shadow-sm p-6 flex flex-col sm:flex-row sm:items-start gap-5">
      {/* Avatar */}
        <div className="size-14 bg-muted rounded-xl flex items-center justify-center border border-border shrink-0">
          <span className="text-muted-foreground font-bold text-lg">
            {getInitials(chat.receiverName)}
          </span>
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-foreground truncate">
              {chat.receiverName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background border border-border px-2 py-1 rounded-md shrink-0">
              <Clock className="size-3" />
              <span>{formatTimeStamp(chat.timeStamp)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <Mail className="size-3.5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground truncate">
              {chat.receiverEmail}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
              {chat.message}
            </p>
            <Link
              href={`/chat?projectId=${chat.gigId}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm shrink-0"
            >
              <MessageCircle className="size-4" />
              <span>Open Chat</span>
            </Link>
          </div>
        </div>
    </div>
  )
}
