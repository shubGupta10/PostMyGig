"use client";

import { INotificationItem } from "@/modules/notifications/components/types/notification";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { MessageSquare, CheckCircle2, XCircle, Bell, ArrowRight } from "lucide-react";

interface NotificationItemProps {
    item: INotificationItem;
    onItemClick: (id: string, link?: string) => void;
}

export function NotificationItem({ item, onItemClick }: NotificationItemProps) {
    const router = useRouter();

    const getIcon = () => {
        switch (item.type) {
            case "ping_received":
                return <MessageSquare className="h-4 w-4 text-primary" />;
            case "ping_accepted":
                return <CheckCircle2 className="h-4 w-4 text-primary" />;
            case "ping_rejected":
                return <XCircle className="h-4 w-4 text-destructive" />;
            default:
                return <Bell className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const handleClick = () => {
        onItemClick(item._id, item.link);
        if (item.link) {
            router.push(item.link);
        }
    };

    const formattedTime = item.createdAt
        ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
        : "";

    return (
        <div
            onClick={handleClick}
            className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer space-y-1.5 ${item.isRead
                    ? "bg-card border-border hover:bg-muted/50 opacity-85"
                    : "bg-secondary/40 border-primary/40 hover:bg-secondary/70 shadow-xs"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-background border-2 border-border flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                            {item.title}
                        </h4>
                        {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground font-normal line-clamp-2 leading-relaxed mt-0.5">
                        {item.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-normal mt-2">
                        <span>{formattedTime}</span>
                        {item.link && (
                            <span className="inline-flex items-center text-primary font-semibold hover:underline gap-1">
                                View <ArrowRight className="w-3 h-3" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
