"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Add this import
import { Home, Bell, Sun, Moon, Globe, User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";

// Import notification store
import { useNotificationStore, useUnreadCount, useIsLoading } from "@/stores/notification-store";

// Helper function to check if professional onboarding is complete
const isProfessionalOnboardingComplete = (user: any): boolean => {
  if (!user) return false;
  const isProfessional = user.user_type === "professional" || user.type === "professional";
    const needsOnboarding = isProfessional && !user.professional_id;


      console.log("Professional check:", { 
    isProfessional, 
    professional_id: user.professional_id,
    needsOnboarding 
  });
      return needsOnboarding;


};

  const needsOnboarding = isProfessionalOnboardingComplete(User);

export function DashboardTopbar() {
  const router = useRouter(); // Add router
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, mode, setMode, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState<"customer" | "professional" | null>(null);
  
  // Use individual selectors for better performance
  const unreadCount = useUnreadCount();
  const isLoading = useIsLoading();
  const { loadNotifications, notifications } = useNotificationStore();

  useEffect(() => {
    if (user?.id) {
      
      // Only load if we have no notifications
      if (notifications.length === 0) {
        
        loadNotifications();
      } else {
     
      }
    }
  }, [user?.id]); 

  // Log unread count changes
  useEffect(() => {
 
  }, [unreadCount]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.name && !user?.full_name) return "U";
    const name = user.name || user.full_name || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  const profileRoute =
    mode === "professional"
      ? "/dashboard/profile/professional"
      : "/dashboard/profile/customer";

  // Handle mode switch with onboarding check
  const handleModeSwitch = (newMode: "customer" | "professional") => {
    // If switching to professional mode, check if onboarding is complete
    if (newMode === "professional") {


     
    

      if (needsOnboarding) {
  
        setPendingMode(newMode);
        setShowOnboardingDialog(true);
        return;
      }
    }
    
    // If switching to customer or professional onboarding is complete, proceed
    performModeSwitch(newMode);
  };
  const performModeSwitch = (newMode: "customer" | "professional") => {
    setMode(newMode);
   
    router.push("/dashboard");
  };

  // Handle onboarding dialog confirmation
  const handleStartOnboarding = () => {
    setShowOnboardingDialog(false);
    // Set the mode first
    if (pendingMode) {
      setMode(pendingMode);
   
      router.push("/onboarding");
    }
    setPendingMode(null);
  };


  const handleCancelOnboarding = () => {
    setShowOnboardingDialog(false);
    setPendingMode(null);

  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-xl font-bold sm:inline-block">Doorsteps Nepal</span>
        </Link>

        <div className="hidden md:flex items-center">
          <span
            className={`rounded-full border px-4 py-1.5 text-md font-bold tracking-wide ${
              user?.mode === "professional"
                ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {user?.mode === "professional"
              ? "PROFESSIONAL DASHBOARD"
              : "CUSTOMER DASHBOARD"}
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ne")}>नेपाली</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Notifications with Count */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/customer/notifications">
              <Bell className="h-4 w-4" />
              {/* Show loading spinner only while loading AND we have no notifications */}
              {isLoading && notifications.length === 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                </span>
              ) : unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground px-1 text-[10px] font-semibold shadow">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              ) : null}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || user?.profile_image || "/placeholder.svg"} alt={user?.name || user?.full_name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline">
                  {language === "ne" ? user?.nameNe : user?.name || user?.full_name || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={profileRoute} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t.nav.profile}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

      
            {/* Mode Switch with Onboarding Check */}
{mode === "customer" ? (
  <DropdownMenuItem asChild>
    <button
      onClick={() => handleModeSwitch("professional")}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
    >
      <span className="h-2 w-2 rounded-full bg-blue-500" />
      {t.nav?.goToProfessional || "Go to Professional Dashboard"}
    </button>
  </DropdownMenuItem>
) : (
  <DropdownMenuItem asChild>
    <button
      onClick={() => handleModeSwitch("customer")}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      {t.nav?.goToCustomer || "Go to Customer Dashboard"}
    </button>
  </DropdownMenuItem>
)}

<DropdownMenuSeparator />

              {/* Logout Button */}
              <DropdownMenuItem 
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                {t.nav.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Onboarding Required Dialog */}
     {/* Onboarding Required Dialog */}
<Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-xl">
        {t.onboarding?.title || "Complete Professional Onboarding"}
      </DialogTitle>
      <DialogDescription className="pt-2">
        {t.onboarding?.description}
      </DialogDescription>
    </DialogHeader>
    <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {t.onboarding?.requiredInfo || "Required Information:"}
        </p>
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          <li>{t.onboarding?.businessName || "Business/Service Name"}</li>
          <li>{t.onboarding?.serviceCategory || "Service Category"}</li>
          <li>{t.onboarding?.experienceYears || "Years of Experience"}</li>
          <li>{t.onboarding?.serviceAreas || "Service Areas"}</li>
        </ul>
      </div>
    </div>
    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Button
        variant="outline"
        onClick={handleCancelOnboarding}
      >
        {t.onboarding?.cancel || "Cancel"}
      </Button>
      <Button
        onClick={handleStartOnboarding}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {t.onboarding?.start || "Start Onboarding"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.dialog?.logout?.title || "Logout"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.dialog?.logout?.description || "Are you sure you want to logout?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              {t.dialog?.cancel || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.dialog?.logout?.loggingOut || "Logging out..."}
                </>
              ) : (
                t.dialog?.logout?.confirm || "Logout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}