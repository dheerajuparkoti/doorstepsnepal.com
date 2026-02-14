"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Bell, 
  CheckCheck, 
  Loader2, 
  Inbox,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  Wallet,
  CreditCard,
  Briefcase,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificationStore } from "@/stores/notification-store";
import { useAuth } from "@/lib/context/auth-context";
import { NotificationTile } from "@/components/notification-screen/notification-tile";
import { groupNotificationsByDate, Notification } from "@/lib/data/notification";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const router = useRouter();
  const { mode, setMode } = useAuth();
  const [showModeSwitchDialog, setShowModeSwitchDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState<'customer' | 'professional' | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  
  const { 
    notifications, 
    isLoading, 
    unreadCount,
    hasOtherModeNotifications,
    loadNotifications,
    markAllAsRead 
  } = useNotificationStore();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const otherModeCount = hasOtherModeNotifications(mode === 'professional');
  const grouped = groupNotificationsByDate(notifications, mode === 'professional');
  
  // Filter notifications based on selected filter
  const getFilteredGrouped = () => {
    if (filterType === 'all') return grouped;
    
    const filtered = new Map();
    grouped.forEach((notifs, date) => {
      const filteredNotifs = notifs.filter(n => {
        if (filterType === 'unread') return !n.is_read;
        if (filterType === 'payments') return n.type.includes('payment');
        if (filterType === 'orders') return n.type.includes('Order');
        if (filterType === 'withdrawals') return n.type.includes('withdrawal');
        return true;
      });
      if (filteredNotifs.length > 0) {
        filtered.set(date, filteredNotifs);
      }
    });
    return filtered;
  };

  const filteredGrouped = getFilteredGrouped();
  
  // Sort headers: Today, Yesterday, then rest
  const headers = Array.from(filteredGrouped.keys()).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return b.localeCompare(a);
  });

  const handleModeSwitch = (targetMode: 'customer' | 'professional') => {
    setPendingMode(targetMode);
    setShowModeSwitchDialog(true);
  };

  const confirmModeSwitch = () => {
    if (pendingMode) {
      setMode(pendingMode);
      setShowModeSwitchDialog(false);
    }
  };

  // Stats for the header
  const totalNotifications = notifications.length;
  const paymentNotifications = notifications.filter(n => n.type.includes('payment')).length;
  const orderNotifications = notifications.filter(n => n.type.includes('Order')).length;

  return (
  <div className="min-h-screen bg-muted/30">

      <div className="w-full px-6 lg:px-10 py-8">

        {/* Header with glass morphism */}
        <div className="mb-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Stats Badges */}
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                  <Bell className="h-3.5 w-3.5" />
                  <span>{totalNotifications} total</span>
                </Badge>
                {unreadCount > 0 && (
                  <Badge variant="default" className="gap-1 px-3 py-1.5 bg-primary">
                    <span>{unreadCount} unread</span>
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setFilterType('all')}>
                    <Bell className="mr-2 h-4 w-4" />
                    All notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('unread')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Unread only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('payments')}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('orders')}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('withdrawals')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Withdrawals
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {unreadCount > 0 && (
                <Button 
                  variant="default" 
                  onClick={() => markAllAsRead()}
                  className="gap-2 rounded-full bg-primary hover:bg-primary/90"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats for mobile */}
          <div className="mt-4 flex gap-2 md:hidden">
            <Badge variant="secondary" className="gap-1">
              <Bell className="h-3.5 w-3.5" />
              {totalNotifications}
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="default" className="gap-1 bg-primary">
                {unreadCount} unread
              </Badge>
            )}
            {paymentNotifications > 0 && (
              <Badge variant="outline" className="gap-1">
                <Wallet className="h-3.5 w-3.5" />
                {paymentNotifications}
              </Badge>
            )}
          </div>
        </div>

{/* Mode Tabs with enhanced styling */}
<Card className="mb-6 overflow-hidden border-none shadow-sm">
  <Tabs value={mode} className="w-full">
    <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted p-1.5 h-auto gap-2">
      <TabsTrigger 
        value="customer"
        onClick={() => mode !== 'customer' && handleModeSwitch('customer')}
        className={cn(
          "py-3 rounded-lg transition-all duration-200",
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          "data-[state=active]:shadow-md",
          "data-[state=inactive]:hover:bg-muted-foreground/10",
          "data-[state=inactive]:text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Customer</span>
          {mode === 'professional' && hasOtherModeNotifications(true) > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {hasOtherModeNotifications(true)}
            </Badge>
          )}
        </div>
      </TabsTrigger>
      <TabsTrigger 
        value="professional"
        onClick={() => mode !== 'professional' && handleModeSwitch('professional')}
        className={cn(
          "py-3 rounded-lg transition-all duration-200",
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          "data-[state=active]:shadow-md",
          "data-[state=inactive]:hover:bg-muted-foreground/10",
          "data-[state=inactive]:text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          <span>Professional</span>
          {mode === 'customer' && hasOtherModeNotifications(false) > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {hasOtherModeNotifications(false)}
            </Badge>
          )}
        </div>
      </TabsTrigger>
    </TabsList>
  </Tabs>
</Card>
        {/* Other Mode Notice with better design */}
        {otherModeCount > 0 && (
          <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-0.5">
              <div className="rounded-xl bg-card/80 backdrop-blur-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-500/20 p-2">
                    <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <span className="font-medium">{otherModeCount}</span> unread notification{otherModeCount > 1 ? 's' : ''} in{' '}
                      <span className="font-semibold">
                        {mode === 'professional' ? 'customer' : 'professional'}
                      </span> mode
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModeSwitch(mode === 'professional' ? 'customer' : 'professional')}
                    className="rounded-full bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 dark:text-orange-400"
                  >
                    Switch now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter indicator */}
        {filterType !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              Filtered by: {filterType}
              <button 
                onClick={() => setFilterType('all')}
                className="ml-2 hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          </div>
        )}

        {/* Notifications List with better spacing */}
        <Card className="border-none shadow-sm">
          <ScrollArea className="h-[calc(100vh-320px)] rounded-xl">
            {isLoading && notifications.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                  <Loader2 className="relative h-10 w-10 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Loading your notifications...</p>
              </div>
            ) : headers.length > 0 ? (
              <div className="space-y-8 p-6">
                {headers.map((header) => (
                  <div key={header} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {header}
                      </h2>
                      <Separator className="flex-1" />
                      <Badge variant="outline" className="text-xs">
                        {filteredGrouped.get(header)?.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {filteredGrouped.get(header)?.map((notification: Notification, index: number) => (
                        <div
                          key={notification.id}
                          className="animate-in slide-in-from-bottom-2 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <NotificationTile notification={notification} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-80 flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Inbox className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No notifications yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                    {filterType !== 'all' 
                      ? `No ${filterType} notifications found. Try changing your filter.`
                      : "When you get notifications, they'll appear here."}
                  </p>
                </div>
                {filterType !== 'all' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setFilterType('all')}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Mode Switch Confirmation Dialog with improved styling */}
        <AlertDialog open={showModeSwitchDialog} onOpenChange={setShowModeSwitchDialog}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Switch to {pendingMode} mode?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                You'll see notifications relevant to your role as a{' '}
                <span className="font-semibold text-foreground">{pendingMode}</span>.
                You can switch back anytime from the top bar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Your current view will be preserved</span>
              </p>
            </div>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmModeSwitch}
                className="rounded-full bg-primary hover:bg-primary/90"
              >
                Switch to {pendingMode}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}