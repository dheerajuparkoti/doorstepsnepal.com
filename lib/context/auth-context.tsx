"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, UserMode } from "@/lib/data/user"; 
import { login as apiLogin, verifyOTP as apiVerifyOTP,setupProfile as apiSetupProfile  } from "@/lib/api/auth";

import { getUserProfile } from "@/lib/api/user";
import { checkIfUserNeedsSetup } from '@/lib/utils/auth-helpers'

interface AuthContextType {
  user: User | null;
  token: string | null;
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  
  // Auth actions
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  setupProfile: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mode, setModeState] = useState<UserMode>("customer");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const setAuthCookies = (authToken: string, userData: User) => {
    // Calculate if setup is actually complete based on name check
    const isActuallySetupComplete = !checkIfUserNeedsSetup(userData);

    // Set cookies for middleware
    document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `setup_complete=${isActuallySetupComplete}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `user_mode=${userData.mode}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    
    // Store user data in cookie for middleware
    const userDataForCookie = {
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      is_setup_complete: isActuallySetupComplete
    };
    document.cookie = `user_data=${JSON.stringify(userDataForCookie)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  };

  // Helper function to clear auth cookies
  const clearAuthCookies = () => {
    document.cookie = 'auth_token=; path=/; max-age=0';
    document.cookie = 'setup_complete=; path=/; max-age=0';
    document.cookie = 'user_mode=; path=/; max-age=0';
    document.cookie = 'user_data=; path=/; max-age=0'; 
  };

  // Load auth state from localStorage and cookies on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
        
        if (storedToken) {
          // If we have a token, fetch fresh user data from API
          try {
            // Use getUserProfile from api/user.ts instead of getCurrentUser
            const freshUserData = await getUserProfile();
          console.log("USER DATA ===========================================================",freshUserData);
            
            // Update stored user data with fresh data
            localStorage.setItem("auth_user", JSON.stringify(freshUserData));
            
            // Set cookies with fresh data
            setAuthCookies(storedToken, freshUserData);
            
            setToken(storedToken);
            setUser(freshUserData);
            setModeState(freshUserData.mode || "customer");
          } catch (error) {
            console.error("Error fetching fresh user data:", error);
            
            // Fallback to stored user data
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser) as User;
              setAuthCookies(storedToken, parsedUser);
              setToken(storedToken);
              setUser(parsedUser);
              setModeState(parsedUser.mode || "customer");
            }
          }
        } else {
          // Check for legacy setup data
          const setupComplete = localStorage.getItem("userSetupComplete");
          if (setupComplete) {
            const savedMode = localStorage.getItem("userMode") as UserMode;
            const userName = localStorage.getItem("userName") || "";
            const userPhone = localStorage.getItem("userPhone") || "";
            const userEmail = localStorage.getItem("userEmail") || "";
            const userGender = localStorage.getItem("userGender") || "";
            const userAgeGroup = localStorage.getItem("userAgeGroup") || "";

            const legacyUser: User = {
              id: 1,
              name: userName,
              nameNe: userName,
              full_name: userName,
              email: userEmail,
              phone: userPhone,
              phone_number: userPhone,
              gender: userGender,
       
              age_group: userAgeGroup,
              isVerified: true,
              isProfessionalVerified: savedMode === "professional",
              mode: savedMode || "customer",
              type: savedMode || "customer",
              is_setup_complete: true,
              is_onboarding_complete:true,
              profile_image: "",
              avatar: "",
            };

            const mockToken = `legacy_${Date.now()}`;
            setAuthCookies(mockToken, legacyUser);
            
            localStorage.setItem("auth_token", mockToken);
            localStorage.setItem("auth_user", JSON.stringify(legacyUser));
            
            setToken(mockToken);
            setUser(legacyUser);
            setModeState(savedMode || "customer");
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadAuthState();
  }, []);

  // Handle route protection on client side (as backup to middleware)
  useEffect(() => {
    if (!isLoading && isInitialized) {
      const isAuthPage = pathname === '/login' || pathname === '/setup' || pathname === '/dashboard'||pathname ==='/onboarding';
      const isProtectedPage = pathname.startsWith('/dashboard') || 
                              pathname.startsWith('/profile') || 
                              pathname.startsWith('/settings');
      
      if (isAuthPage && user) {
        // If logged in and trying to access auth pages
        console.log("PROFESSIONAL ID IS",user.professional_id);
        if (pathname === '/login') {
          router.push('/dashboard');
        } else if (pathname === '/setup' && user.is_setup_complete ) {
          router.push('/dashboard');
        }
        // else if (pathname == '/dashboard' && (user.professional_id)==null){
        //     router.push('/onboarding');
        // }
        else if (pathname == '/onboarding'){
            router.push('/onboarding');
        }

        
      }
      
      if (isProtectedPage && !user) {
        // If not logged in and trying to access protected pages
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [pathname, user, isLoading, isInitialized, router]);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    localStorage.setItem("userMode", newMode);
    document.cookie = `user_mode=${newMode}; path=/; max-age=${60 * 60 * 24 * 7}`;
    
    if (user) {
      const updatedUser = { 
        ...user, 
        mode: newMode,
        type: newMode,
        isProfessionalVerified: newMode === "professional" 
      };
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  };

  const toggleMode = () => {
    const newMode = mode === "customer" ? "professional" : "customer";
    setMode(newMode);
  };

  const login = async (phone: string) => {
    try {
      // Store phone for OTP verification
      localStorage.setItem("temp_phone", phone);
      
      // Call API to send OTP
      await apiLogin(phone);
      
      return;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      // Call API to verify OTP
      const response = await apiVerifyOTP(phone, otp);
      
      // Store the token
      const authToken = response.access_token;
      localStorage.setItem("auth_token", authToken);
      setToken(authToken);
      
      let userData: User;
      
      try {
        // Use getUserProfile from api/user.ts instead of getCurrentUser
        const apiUserData = await getUserProfile();
        userData = apiUserData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        // Fallback to basic data from OTP response
        const apiUser = response.user || {
          id: 1,
          phone_number: phone,
          full_name: "",
          is_setup_complete: false,
          type: "customer" as UserMode,
        };
        
        userData = {
          id: apiUser.id,
          phone_number: apiUser.phone_number,
          phone: apiUser.phone_number,
          full_name: apiUser.full_name || "",
          name: apiUser.full_name || "",
          nameNe: apiUser.full_name || "",
          email: apiUser.email || "",
          gender: apiUser.gender || "",
          age_group: apiUser.age_group || "",
     
          profile_image: apiUser.profile_image || "",
          avatar: apiUser.profile_image || "",
          mode: apiUser.type || "customer",
          type: apiUser.type || "customer",
          is_setup_complete: apiUser.is_setup_complete || false,
          is_onboarding_complete:apiUser.is_onboarding_complete || false,
          isVerified: true,
          isProfessionalVerified: apiUser.type === "professional",
        };
      }
      
      // Store user in localStorage
      localStorage.setItem("auth_user", JSON.stringify(userData));
      localStorage.removeItem("temp_phone");
      
      // Set cookies for middleware
      setAuthCookies(authToken, userData);
      
      // Clear legacy data to avoid conflicts
      localStorage.removeItem("userSetupComplete");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userGender");
      localStorage.removeItem("userAgeGroup");
      localStorage.removeItem("userMode");
      
      setUser(userData);
      setModeState(userData.mode);
      
      const needsSetup = checkIfUserNeedsSetup(userData);
      
      if (needsSetup) {
        router.push("/setup");
      } else {
        router.push("/dashboard");
      }
      
      return;
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      throw new Error(error.message || "Invalid OTP");
    }
  };

  
const setupProfile = async (data: any) => {
  try {
    console.log("IM FROM AUTH -CONTEXT SETUP PROFILE");
    
    if (!user || !token) {
      throw new Error("User not authenticated");
    }

    // Call the API to update all profile fields at once
    const updatedUserData = await apiSetupProfile({
      full_name: data.full_name,
      gender: data.gender,
      age_group: data.age_group,
      email: data.email || user.email,
    });

    // Create updated user object with the response from API
    const updatedUser: User = {
      ...user,
      ...updatedUserData,
      full_name: data.full_name,
      name: data.full_name,
      nameNe: data.full_name,
      email: data.email || user.email,
      gender: data.gender,
      age_group: data.age_group,
      type: data.user_type,
      mode: data.user_type,
      is_setup_complete: true,
      //  For professionals, onboarding starts as incomplete
      // For customers, onboarding is considered complete (or N/A)
      is_onboarding_complete: data.user_type === "professional" ? false : true,
      isProfessionalVerified: data.user_type === "professional",
    };
    
    // Store in both formats for compatibility
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    
    // Update cookies
    setAuthCookies(token, updatedUser);
    
    // Also store legacy data for backward compatibility
    localStorage.setItem("userSetupComplete", "true");
    localStorage.setItem("userName", data.full_name);
    localStorage.setItem("userPhone", user.phone || user.phone_number || "");
    localStorage.setItem("userEmail", data.email || "");
    localStorage.setItem("userGender", data.gender);
    localStorage.setItem("userAgeGroup", data.age_group);
    localStorage.setItem("userMode", data.user_type);
    
    setUser(updatedUser);
    setModeState(data.user_type);
    
    // Redirect to dashboard
    router.push("/dashboard");
    
    return;
  } catch (error: any) {
    console.error("Setup profile error:", error);
    throw new Error(error.message || "Failed to save profile");
  }
};

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("temp_phone");
    
    // Clear legacy data
    localStorage.removeItem("userSetupComplete");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userGender");
    localStorage.removeItem("userAgeGroup");
    localStorage.removeItem("userMode");
    
    // Clear cookies
    clearAuthCookies();
    
    setUser(null);
    setToken(null);
    setModeState("customer");
    // Force a hard redirect to login with cache busting
    window.location.href = "/?logout=true";
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      
      // Update cookies if needed
      if (token) {
        setAuthCookies(token, updatedUser);
      }
      
      // Also update legacy data if relevant fields changed
      if (userData.full_name || userData.name) {
        localStorage.setItem("userName", updatedUser.full_name || updatedUser.name);
      }
      if (userData.email) {
        localStorage.setItem("userEmail", updatedUser.email || "");
      }
      if (userData.gender) {
        localStorage.setItem("userGender", updatedUser.gender || "");
      }
      if (userData.age_group) {
        localStorage.setItem("userAgeGroup", updatedUser.age_group ||  "");
      }
      if (userData.mode || userData.type) {
        localStorage.setItem("userMode", updatedUser.mode || updatedUser.type || "customer");
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    const currentToken = localStorage.getItem("auth_token");
    
    if (!currentToken) {
      console.warn("No token found, cannot refresh user");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use getUserProfile from api/user.ts instead of getCurrentUser
      const freshUserData = await getUserProfile();

          console.log("Refreshed user data:", {
      mode: freshUserData.mode,
      professional_id: freshUserData.professional_id,
      hasProfessionalId: !!freshUserData.professional_id
    });
      
      // Update stored user data
      localStorage.setItem("auth_user", JSON.stringify(freshUserData));
      
      // Set cookies with fresh data
      setAuthCookies(currentToken, freshUserData);
      
      setUser(freshUserData);
      setModeState(freshUserData.mode || "customer");
      
    } catch (error) {
      console.error("Error refreshing user data:", error);
      
      // If refresh fails, clear auth state (possibly token expired)
      if (error instanceof Error && error.message.includes("401")) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };
if (!isInitialized) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

  const value: AuthContextType = {
    user,
    token,
    mode,
    setMode,
    toggleMode,
    isLoggedIn: !!user,
    isLoading,
    login,
    verifyOTP,
    setupProfile,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}