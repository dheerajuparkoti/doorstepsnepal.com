// "use client";

// import Link from "next/link";
// import { useI18n } from "@/lib/i18n/context";
// import { useTheme } from "@/lib/theme/context";
// import { useAuth } from "@/lib/context/auth-context";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Home, Bell, Sun, Moon, Globe, User, Settings, LogOut, ChevronDown } from "lucide-react";

// export function DashboardTopbar() {
//   const { t, language, setLanguage } = useI18n();
//   const { theme, toggleTheme } = useTheme();
//   const { user, mode, setMode } = useAuth();

//   return (
//     <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
//       {/* Logo */}
//       <Link href="/" className="flex items-center gap-2">
//         <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//           <Home className="h-5 w-5 text-primary-foreground" />
//         </div>
//         <span className="hidden text-xl font-bold sm:inline-block">Doorsteps Nepal</span>
//       </Link>

//       {/* Mode Switch */}
//       <div className="flex items-center rounded-lg border border-border bg-muted p-1">
//         <button
//           onClick={() => setMode("customer")}
//           className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
//             mode === "customer"
//               ? "bg-primary text-primary-foreground"
//               : "text-muted-foreground hover:text-foreground"
//           }`}
//         >
//           {t.dashboard.customerMode}
//         </button>
//         <button
//           onClick={() => setMode("professional")}
//           className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
//             mode === "professional"
//               ? "bg-primary text-primary-foreground"
//               : "text-muted-foreground hover:text-foreground"
//           }`}
//         >
//           {t.dashboard.professionalMode}
//         </button>
//       </div>

//       {/* Right Side Actions */}
//       <div className="flex items-center gap-2">
//         {/* Language */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Globe className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setLanguage("ne")}>नेपाली</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Theme */}
//         <Button variant="ghost" size="icon" onClick={toggleTheme}>
//           {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
//         </Button>

//         {/* Notifications */}
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-4 w-4" />
//           <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
//             3
//           </span>
//         </Button>

//         {/* User Menu */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="gap-2 pl-2 pr-1">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
//                 <AvatarFallback className="bg-primary/10 text-primary">
//                   {user?.name?.split(" ").map((n) => n[0]).join("")}
//                 </AvatarFallback>
//               </Avatar>
//               <span className="hidden text-sm font-medium md:inline">
//                 {language === "ne" ? user?.nameNe : user?.name}
//               </span>
//               <ChevronDown className="h-4 w-4 text-muted-foreground" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-48">
//             <DropdownMenuItem asChild>
//               <Link href="/dashboard/profile" className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 {t.nav.profile}
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <Link href="/dashboard/settings" className="flex items-center gap-2">
//                 <Settings className="h-4 w-4" />
//                 {t.nav.settings}
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <Link href="/" className="flex items-center gap-2 text-destructive">
//                 <LogOut className="h-4 w-4" />
//                 {t.nav.logout}
//               </Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Home, Bell, Sun, Moon, Globe, User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";

export function DashboardTopbar() {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, mode, setMode, logout } = useAuth(); // Get logout function
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // logout() will handle the redirect
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

        {/* Mode Switch */}
        <div className="flex items-center rounded-lg border border-border bg-muted p-1">
          <button
            onClick={() => setMode("customer")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "customer"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.dashboard.customerMode}
          </button>
          <button
            onClick={() => setMode("professional")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "professional"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.dashboard.professionalMode}
          </button>
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

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              3
            </span>
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
                <Link href="/dashboard/my-user-profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t.nav.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t.nav.settings}
                </Link>
              </DropdownMenuItem>
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

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.dialog.logout.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.dialog.logout.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              {t.dialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.dialog.logout.loggingOut}
                </>
              ) : (
                t.dialog.logout.confirm
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}