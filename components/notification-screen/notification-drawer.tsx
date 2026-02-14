"use client";

import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotificationStore } from "@/stores/notification-store";
import { NotificationTile } from "./notification-tile";
import { useAuth } from "@/lib/context/auth-context";

export function NotificationDrawer() {
  const router = useRouter();
 const { mode } = useAuth(); 
  const { 
    notifications, 
    isLoading, 
    unreadCount,
    markAllAsRead,
    hasOtherModeNotifications
  } = useNotificationStore();

  const otherModeCount = hasOtherModeNotifications(mode === 'professional');

  const handleViewAll = () => {
    router.push('/dashboard/notifications');
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // Show only recent notifications (first 5)
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </Button>
        )}
      </div>

      <Separator />

      {/* Other Mode Notice */}
      {otherModeCount > 0 && (
        <div className="p-3">
          <div className="rounded-lg bg-orange-50 p-3 text-sm text-orange-800 dark:bg-orange-950/50 dark:text-orange-200">
            <p className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>
                You have {otherModeCount} notification{otherModeCount > 1 ? 's' : ''} in{' '}
                {mode === 'professional' ? 'customer' : 'professional'} mode
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentNotifications.length > 0 ? (
          <div className="space-y-1 p-2">
            {recentNotifications.map((notification) => (
              <NotificationTile
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={handleViewAll}
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
}