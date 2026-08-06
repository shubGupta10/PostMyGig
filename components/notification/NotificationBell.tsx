"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationPopover } from "./NotificationPopover";
import { INotificationItem } from "./types/notification";
import { useSession } from "next-auth/react";

export function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<INotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const fetchNotifications = useCallback(async () => {
        if (!session?.user?.email) return;
        try {
            setLoading(true);
            const res = await fetch("/api/notifications?page=1&limit=10");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notification || data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.email]);

    useEffect(() => {
        fetchNotifications();

        const handleInstantRefresh = () => fetchNotifications();
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchNotifications();
            }
        };

        window.addEventListener("refresh-notification", handleInstantRefresh);
        window.addEventListener("focus", handleInstantRefresh);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const interval = setInterval(fetchNotifications, 10000);
        return () => {
            window.removeEventListener("refresh-notification", handleInstantRefresh);
            window.removeEventListener("focus", handleInstantRefresh);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearInterval(interval);
        }
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        // Optimistic UI update
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id }),
            });
        } catch (err) {
            console.error("Error marking notification read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        // Optimistic UI update
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAll: true }),
            });
        } catch (err) {
            console.error("Error marking all notifications read:", err);
        }
    };

    if (!session) return null;

    return (
        <Popover modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-all duration-200 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-xl"
                >
                    <Bell className="h-5 w-5 text-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                    )}
                    <span className="sr-only">Toggle notifications ({unreadCount} unread)</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="p-0 border-0 bg-transparent shadow-none w-auto"
            >
                <NotificationPopover
                    notifications={notifications}
                    unreadCount={unreadCount}
                    loading={loading}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                />
            </PopoverContent>
        </Popover>
    );
}
