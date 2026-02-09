"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestRoute({ 
  children, 
  redirectTo = "/dashboard"
}: GuestRouteProps) {
  const { isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoading, isLoggedIn, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}