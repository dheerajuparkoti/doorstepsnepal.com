"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSetupComplete?: boolean;
  allowedTypes?: Array<"customer" | "professional">;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireSetupComplete = true,
  allowedTypes,
  redirectTo
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // auth context 
  const { user, isLoading, isLoggedIn } = useAuth();
  
  // Helper to check if user needs setup
  const checkIfUserNeedsSetup = () => {
    if (!user) return true;
    
    const full_name = user.full_name;
    const phone_number = user.phone_number;
    
    if (!full_name || full_name.trim() === '') {
      return true;
    }

    if (full_name === phone_number) {
      return true;
    }
    return false;
  };

  const needsSetup = checkIfUserNeedsSetup();
  const userType = user?.type || "customer";

  useEffect(() => {
    if (!isLoading) {
      // Redirect if authentication is required but user is not logged in
      if (requireAuth && !isLoggedIn) {
        const loginUrl = redirectTo || "/login";
        const finalUrl = new URL(loginUrl, window.location.origin);
        finalUrl.searchParams.set("redirect", pathname);
        router.push(finalUrl.toString());
        return;
      }

      // Redirect if setup is required but not complete
      if (requireAuth && requireSetupComplete && isLoggedIn && needsSetup) {
        router.push(redirectTo || "/setup");
        return;
      }

      // Redirect if user type is not allowed
      if (requireAuth && allowedTypes && userType && !allowedTypes.includes(userType as any)) {
        router.push(redirectTo || "/dashboard");
        return;
      }
    }
  }, [
    user, 
    isLoading, 
    isLoggedIn, 
    router, 
    requireAuth, 
    requireSetupComplete, 
    allowedTypes, 
    redirectTo,
    pathname,
    needsSetup,
    userType
  ]);

 
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 mt-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (requireAuth && !isLoggedIn) {
    return null;
  }


  if (requireAuth && requireSetupComplete && isLoggedIn && needsSetup) {
    return null;
  }


  if (requireAuth && allowedTypes && userType && !allowedTypes.includes(userType as any)) {
    return null;
  }


  return <>{children}</>;
}

