"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSetupComplete?: boolean;
  allowedModes?: Array<"customer" | "professional">;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireSetupComplete = true,
  allowedModes,
  redirectTo
}: ProtectedRouteProps) {
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isLoggedIn) {
        router.push(redirectTo || "/login");
        return;
      }

      if (requireAuth && requireSetupComplete && user && !user.is_setup_complete) {
        router.push(redirectTo || "/setup");
        return;
      }

      if (requireAuth && allowedModes && user && !allowedModes.includes(user.mode)) {
        router.push(redirectTo || "/dashboard");
        return;
      }
    }
  }, [user, isLoading, isLoggedIn, router, requireAuth, requireSetupComplete, allowedModes, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requireAuth && !isLoggedIn) {
    return null;
  }

  if (requireAuth && requireSetupComplete && user && !user.is_setup_complete) {
    return null;
  }

  if (requireAuth && allowedModes && user && !allowedModes.includes(user.mode)) {
    return null;
  }

  return <>{children}</>;
}


