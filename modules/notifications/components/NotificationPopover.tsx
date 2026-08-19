"use client";

import { INotificationItem } from "./types/notification";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck } from "lucide-react";

interface NotificationPopoverProps {
  notifications: INotificationItem[];
  unreadCount: number;
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

function NotificationItemSkeleton() {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-border bg-card space-y-2">
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-2.5 w-16 rounded-md" />
            <Skeleton className="h-2.5 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationPopover({
  notifications,
  unreadCount,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPopoverProps) {
  return (
    <div className="w-80 sm:w-96 bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[480px]">
      {/* Popover Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground font-semibold text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="h-7 text-[11px] text-muted-foreground hover:text-foreground font-medium px-2 rounded-lg cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Popover Body */}
      <div className="p-3 overflow-y-auto space-y-2.5 flex-1 min-h-[200px]">
        {loading ? (
          <div className="space-y-2.5">
            <NotificationItemSkeleton />
            <NotificationItemSkeleton />
            <NotificationItemSkeleton />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2">
            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground shadow-xs">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">No notifications yet</p>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              When clients or freelancers pitch for projects, alerts will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationItem key={item._id} item={item} onItemClick={onMarkAsRead} />
          ))
        )}
      </div>
    </div>
  );
}
