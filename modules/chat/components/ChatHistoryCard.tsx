"use client"

import { Calendar, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { ChatData } from "@/app/(pages)/(socket)/chat-history/types"
import { formatTimeStamp, getInitials } from "@/lib/helpers"
import { Button } from "@/components/ui/button"

export function ChatHistoryCard({ chat }: { chat: ChatData }) {
  return (
    <div className="bg-card text-card-foreground rounded-2xl border-2 border-border shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="size-11 sm:size-12 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center font-bold text-sm border border-border shrink-0 shadow-xs">
          {getInitials(chat.receiverName)}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold text-foreground truncate">
              {chat.receiverName}
            </h3>
            <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3 text-muted-foreground" />
              {chat.receiverEmail}
            </span>
          </div>

          <p className="text-sm font-normal text-muted-foreground line-clamp-1 leading-relaxed">
            "{chat.message}"
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatTimeStamp(chat.timeStamp)}</span>
          </div>
        </div>
      </div>

      <Button
        asChild
        className="h-10 text-xs font-semibold px-5 rounded-xl shrink-0 shadow-xs cursor-pointer"
      >
        <Link href={`/chat?projectId=${chat.gigId}`}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Open Chat
        </Link>
      </Button>
    </div>
  )
}
