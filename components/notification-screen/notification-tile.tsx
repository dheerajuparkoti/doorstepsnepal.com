"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, Trash2, MoreVertical, Check, Megaphone } from "lucide-react";
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
import { NotificationDetailDialog } from "./notification-detail-dialog";
import { cn } from "@/lib/utils";
import { NepaliDateService } from "@/lib/utils/nepaliDate";
import { useAuth } from "@/lib/context/auth-context";

interface NotificationTileProps {
  notification: Notification;
}

export function NotificationTile({ notification }: NotificationTileProps) {
  const router = useRouter();
   const { mode } = useAuth(); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { markAsRead, deleteNotification } = useNotificationStore();

  const DIALOG_ROUTES = ['announcement', 'professional', 'customer', 'profile'];

 // Helper to determine if notification is for professional
const isProfessionalNotification = () => {
  const professionalTypes = [
    'New Order',
    'payment_received',
    'withdrawal_approved',
    'withdrawal_completed',
    'withdrawal_rejected',
    'Order Update'
  ];

  const professionalTitles = [
    'Inspection Approved',
    'Inspection Rejected',
    'Order Cancelled'
  ];

  // Check if it's a professional notification
  return professionalTypes.includes(notification.type) ||
    (notification.type === 'Order Update' && professionalTitles.includes(notification.title));
};

// Helper to determine if notification is for customer
const isCustomerNotification = () => {
  const customerTitles = [
    'Inspection Completed',
    'Payment Successful',
  ];

  return notification.type === 'Order Update' && customerTitles.includes(notification.title);
};

// Helper to check if it's a payment notification for customer
const isCustomerPaymentNotification = () => {
  return notification.title === 'Payment Successful';
};

// Helper to check if it's a payment notification for professional
const isProfessionalPaymentNotification = () => {
  return notification.type === 'payment_received';
};

// Get route based on mode and notification type
const getRouteForNotification = () => {
  const isProfessional = mode === 'professional';
  const isProNotif = isProfessionalNotification();
  const isCustNotif = isCustomerNotification();
  const isCustomerPayment = isCustomerPaymentNotification();
  const isProfessionalPayment = isProfessionalPaymentNotification();
  const orderId = notification.custom_data?.orderId || notification.custom_data?.order_id;
  const withdrawalId = notification.custom_data?.withdrawal_id;

  // Professional routes
  if (isProfessional) {
    // Professional notifications (New Order, Order Updates for approval/rejection, etc.)
    if (isProNotif) {
      // payment_received goes to payments page
      if (isProfessionalPayment && orderId) {
        return `/dashboard/payments/orders/${orderId}`;
      }
      
      if (orderId) {
        // Route to professional order details
        return `/dashboard/professional/jobs/job-details/${orderId}`;
      }
      if (withdrawalId) {
        // Route to professional withdrawal details
        return `/dashboard/professional/wallet`;
      }
      if (notification.type === 'withdrawal_approved' || 
          notification.type === 'withdrawal_completed' || 
          notification.type === 'withdrawal_rejected') {
        return `/dashboard/professional/wallet || ''}`;
      }
      // Default professional dashboard
      return '/dashboard/professional';
    } 
    // Customer notifications in professional mode (Inspection Completed, Payment Successful, etc.)
    else {
      if (orderId) {
        // Customer Payment Successful goes to payments page
        if (isCustomerPayment) {
          return `/dashboard/payments/orders/${orderId}`;
        }
        // Other customer notifications go to booking details
        return `/dashboard/customer/bookings/booking-details/${orderId}`;
      }
      return `/dashboard/notifications/${notification.id}`;
    }
  } 
  // Customer routes
  else {
    // Customer notifications (Inspection Completed, Payment Successful, etc.)
    if (isCustNotif || !isProNotif) {
      if (orderId) {
        // Payment Successful goes to payments page
        if (isCustomerPayment) {
          return `/dashboard/payments/orders/${orderId}`;
        }
        // Other customer notifications go to booking details
        return `/dashboard/customer/bookings/booking-details/${orderId}`;
      }
      // Default customer dashboard
      return '/dashboard/customer';
    } 
    // Professional notifications in customer mode (should be filtered out, but just in case)
    else {
      if (orderId) {
        // Even if professional notification appears in customer mode, payment_received should go to payments
        if (isProfessionalPayment) {
          return `/dashboard/payments/orders/${orderId}`;
        }
        return `/dashboard/professional/jobs/job-details/${orderId}`;
      }
      return `/dashboard/notifications/${notification.id}`;
    }
  }
};

  const handleClick = async () => {
    if (!notification.is_read) {
      await markAsRead(notification.id, notification.isGlobal);
    }

    // Show detail dialog for announcement/profile/customer/professional routes
    if (notification.action_route && DIALOG_ROUTES.includes(notification.action_route)) {
      setShowDetailDialog(true);
      return;
    }

    if (notification.isGlobal) {
      setShowDetailDialog(true);
      return;
    }

    const route = getRouteForNotification();
    if (route) {
      router.push(route);
    } else {
      router.push(`/dashboard/notifications/${notification.id}`);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(notification.id, notification.isGlobal);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await deleteNotification(notification.id, notification.isGlobal);
    setShowDeleteDialog(false);
  };

  const timeAgo = NepaliDateService.formatTime((notification.created_at));
  const imageUrl = notification.custom_data?.image_url as string | undefined;

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-colors hover:bg-accent/50 overflow-hidden",
          !notification.is_read && notification.isGlobal && "border-l-4 border-l-orange-500 bg-orange-500/5",
          !notification.is_read && !notification.isGlobal && "border-l-4 border-l-primary bg-primary/5"
        )}
        onClick={handleClick}
      >
        {/* Banner image */}
        {imageUrl && (
          <div className="w-full h-36 bg-muted">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <div className="p-3 flex gap-3">
          {/* Icon */}
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            notification.isGlobal
              ? notification.is_read ? "bg-muted" : "bg-orange-500/10"
              : notification.is_read ? "bg-muted" : "bg-primary/10"
          )}>
            {notification.isGlobal ? (
              <Megaphone className={cn("h-4 w-4", notification.is_read ? "text-muted-foreground" : "text-orange-500")} />
            ) : notification.is_read ? (
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
                    {notification.isGlobal ? 'Dismiss' : 'Delete'}
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

      {/* Notification Detail Dialog */}
      <NotificationDetailDialog
        notification={notification}
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {notification.isGlobal ? 'Dismiss Notification' : 'Delete Notification'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {notification.isGlobal
                ? 'This will dismiss the broadcast notification. You can still see it again if the admin resends it.'
                : 'Are you sure you want to delete this notification? This action cannot be undone.'}
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
              {notification.isGlobal ? 'Dismiss' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}