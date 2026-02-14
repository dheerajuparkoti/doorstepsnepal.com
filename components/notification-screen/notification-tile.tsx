"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, Trash2, MoreVertical, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Notification, getNotificationTitle, getNotificationBody } from "@/lib/data/notification";
import { useNotificationStore } from "@/stores/notification-store";
import { cn } from "@/lib/utils";

interface NotificationTileProps {
  notification: Notification;
}

export function NotificationTile({ notification }: NotificationTileProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { markAsRead, deleteNotification } = useNotificationStore();

  const handleClick = async () => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Handle navigation based on action_route
    if (notification.action_route === "order") {
      const orderId = notification.custom_data?.orderId || notification.custom_data?.order_id;
      if (orderId) {
        router.push(`/dashboard/orders/${orderId}`);
      }
    } else {
      // Default: open notification detail
      router.push(`/dashboard/notifications/${notification.id}`);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(notification.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await deleteNotification(notification.id);
    setShowDeleteDialog(false);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <>
      <Card
        className={cn(
          "p-3 cursor-pointer transition-colors hover:bg-accent/50",
          !notification.is_read && "border-l-4 border-l-primary bg-primary/5"
        )}
        onClick={handleClick}
      >
        <div className="flex gap-3">
          {/* Icon */}
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            notification.is_read ? "bg-muted" : "bg-primary/10"
          )}>
            {notification.is_read ? (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Bell className="h-4 w-4 text-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className={cn(
                "text-sm",
                !notification.is_read && "font-semibold"
              )}>
                {getNotificationTitle(notification)}
              </h4>
              
              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.is_read && (
                    <DropdownMenuItem onClick={handleMarkAsRead}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {getNotificationBody(notification)}
            </p>
            
            <p className="text-xs text-muted-foreground/60">
              {timeAgo}
            </p>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}