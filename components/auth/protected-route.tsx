// "use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSetupComplete?: boolean;
  requireProfessionalOnboarding?: boolean;
  allowedTypes?: Array<"customer" | "professional">;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireSetupComplete = true,
  requireProfessionalOnboarding = true,
  allowedTypes,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoading, isLoggedIn } = useAuth();

  /* ----------------------------------------
     Check if user profile setup is incomplete
  -----------------------------------------*/
  const checkIfUserNeedsSetup = () => {
    if (!user) return true;

    const fullName = user.full_name;
    const phoneNumber = user.phone_number;

    if (!fullName || fullName.trim() === "") return true;
    if (fullName === phoneNumber) return true;

    return false;
  };

  /* ----------------------------------------
     Check if professional onboarding incomplete
  -----------------------------------------*/
const checkIfProfessionalNeedsOnboarding = () => {
  if (!user) return false;

  const isProfessional = user.user_type === "professional" || user.type === "professional";
  
  // If professional mode but no professional_id, they need onboarding
  // If they have professional_id, onboarding is complete
  const needsOnboarding = isProfessional && !user.professional_id;
  
  console.log("Professional check:", { 
    isProfessional, 
    professional_id: user.professional_id,
    needsOnboarding 
  });
  
  return needsOnboarding;
};

  const needsSetup = checkIfUserNeedsSetup();
  const needsOnboarding = checkIfProfessionalNeedsOnboarding();
  const userType = user?.user_type || "customer";

  /* ----------------------------------------
     Redirect Logic
  -----------------------------------------*/
  useEffect(() => {
    if (isLoading) return;

    // Not logged in
    if (requireAuth && !isLoggedIn) {
      const loginUrl = redirectTo || "/login";
      const finalUrl = new URL(loginUrl, window.location.origin);
      finalUrl.searchParams.set("redirect", pathname);
      router.push(finalUrl.toString());
      return;
    }

    //  Setup incomplete
    if (requireAuth && requireSetupComplete && isLoggedIn && needsSetup) {
      router.push(redirectTo || "/setup");
      return;
    }

    // Professional onboarding incomplete
    if (
      requireAuth &&
      requireProfessionalOnboarding &&
      isLoggedIn &&
      needsOnboarding
    ) {
      router.push(redirectTo || "/onboarding");
      return;
    }

    // User type restriction
    if (
      requireAuth &&
      allowedTypes &&
      userType &&
      !allowedTypes.includes(userType)
    ) {
      router.push(redirectTo || "/dashboard");
      return;
    }
  }, [
    isLoading,
    isLoggedIn,
    requireAuth,
    requireSetupComplete,
    requireProfessionalOnboarding,
    allowedTypes,
    redirectTo,
    pathname,
    needsSetup,
    needsOnboarding,
    userType,
    router,
  ]);

  /* ----------------------------------------
     Loading State
  -----------------------------------------*/
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-sm text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  /* ----------------------------------------
     Prevent Page Flashing Before Redirect
  -----------------------------------------*/

  if (requireAuth && !isLoggedIn) return null;

  if (requireAuth && requireSetupComplete && isLoggedIn && needsSetup)
    return null;

  if (
    requireAuth &&
    requireProfessionalOnboarding &&
    isLoggedIn &&
    needsOnboarding
  )
    return null;

  if (
    requireAuth &&
    allowedTypes &&
    userType &&
    !allowedTypes.includes(userType)
  )
    return null;

  return <>{children}</>;
}
