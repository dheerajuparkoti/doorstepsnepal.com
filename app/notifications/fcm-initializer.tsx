"use client";

import { useEffect, useRef } from "react";
import { generateToken, refreshTokenRegistration } from "@/app/notifications/fcm-web";
import { useFCMHandler } from "@/hooks/use-fcm-handler";
import { useUser } from "@/stores/user-store";

export default function FCMInitializer() {
  const user = useUser();
  const initializedRef = useRef(false);
  
  
  useFCMHandler();

  // Handle token generation when user is available
  useEffect(() => {
    
    if (user?.id) {
      console.log("👤 User detected in FCMInitializer:", user.id);
      
      const timer = setTimeout(() => {
        refreshTokenRegistration();
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // User logged out, but  keep the token for potential next login
      console.log("🚪 No user, FCM token preserved for next login");
    }
  }, [user?.id]); 

  // Initial token generation (runs once on mount)
  useEffect(() => {
    if (!initializedRef.current) {
      console.log("🔄 Initial FCM setup");
      generateToken();
      initializedRef.current = true;
    }
  }, []);

  return null;
}