"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, UserMode } from "@/lib/data/auth";
import { login as apiLogin, verifyOTP as apiVerifyOTP } from "@/lib/api/auth";

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

  // Helper function to set auth cookies
  const setAuthCookies = (authToken: string, userData: User) => {
    // Set cookies for middleware
    document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    document.cookie = `setup_complete=${userData.is_setup_complete}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `user_mode=${userData.mode}; path=/; max-age=${60 * 60 * 24 * 7}`;
  };

  // Helper function to clear auth cookies
  const clearAuthCookies = () => {
    document.cookie = 'auth_token=; path=/; max-age=0';
    document.cookie = 'setup_complete=; path=/; max-age=0';
    document.cookie = 'user_mode=; path=/; max-age=0';
  };

  // Load auth state from localStorage and cookies on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          
          // Sync cookies with localStorage
          setAuthCookies(storedToken, parsedUser);
          
          setToken(storedToken);
          setUser(parsedUser);
          setModeState(parsedUser.mode || "customer");
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
              ageGroup: userAgeGroup,
              age_group: userAgeGroup,
              isVerified: true,
              isProfessionalVerified: savedMode === "professional",
              mode: savedMode || "customer",
              user_type: savedMode || "customer",
              is_setup_complete: true,
              profile_image: "",
              avatar: "",
            };

            // Create a mock token for legacy users
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
      const isAuthPage = pathname === '/login' || pathname === '/setup';
      const isProtectedPage = pathname.startsWith('/dashboard') || 
                              pathname.startsWith('/profile') || 
                              pathname.startsWith('/settings');
      
      if (isAuthPage && user) {
        // If logged in and trying to access auth pages
        if (pathname === '/login') {
          router.push('/dashboard');
        } else if (pathname === '/setup' && user.is_setup_complete) {
          router.push('/dashboard');
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
        user_type: newMode,
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
      
      // Map API response to our User type
      const apiUser = response.user || {
        id: 1,
        phone_number: phone,
        full_name: "",
        is_setup_complete: false,
        user_type: "customer" as UserMode,
      };
      
      const userData: User = {
        id: apiUser.id,
        phone_number: apiUser.phone_number,
        phone: apiUser.phone_number,
        full_name: apiUser.full_name || "",
        name: apiUser.full_name || "",
        nameNe: apiUser.full_name || "",
        email: apiUser.email || "",
        gender: apiUser.gender || "",
        age_group: apiUser.age_group || "",
        ageGroup: apiUser.age_group || "",
        profile_image: apiUser.profile_image || "",
        avatar: apiUser.profile_image || "",
        user_type: apiUser.user_type || "customer",
        mode: apiUser.user_type || "customer",
        is_setup_complete: apiUser.is_setup_complete || false,
        isVerified: true,
        isProfessionalVerified: apiUser.user_type === "professional",
      };
      
      // Store token and user
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      localStorage.removeItem("temp_phone");
      
      // Set cookies for middleware
      setAuthCookies(response.access_token, userData);
      
      // Clear legacy data to avoid conflicts
      localStorage.removeItem("userSetupComplete");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userGender");
      localStorage.removeItem("userAgeGroup");
      localStorage.removeItem("userMode");
      
      setToken(response.access_token);
      setUser(userData);
      setModeState(userData.mode);
      
      // Redirect based on setup status
      if (userData.is_setup_complete) {
        router.push("/dashboard");
      } else {
        router.push("/setup");
      }
      
      return;
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      throw new Error(error.message || "Invalid OTP");
    }
  };

  const setupProfile = async (data: any) => {
    try {
      if (user && token) {
        const updatedUser: User = {
          ...user,
          full_name: data.full_name,
          name: data.full_name,
          nameNe: data.full_name,
          email: data.email || user.email,
          gender: data.gender,
          age_group: data.age_group,
          ageGroup: data.age_group,
          user_type: data.user_type,
          mode: data.user_type,
          is_setup_complete: true,
          isProfessionalVerified: data.user_type === "professional",
        };
        
        // Store in both formats for compatibility
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        
        // Update cookies
        setAuthCookies(token, updatedUser);
        
        // Also store legacy data for backward compatibility
        localStorage.setItem("userSetupComplete", "true");
        localStorage.setItem("userName", data.full_name);
        localStorage.setItem("userPhone", user.phone);
        localStorage.setItem("userEmail", data.email || "");
        localStorage.setItem("userGender", data.gender);
        localStorage.setItem("userAgeGroup", data.age_group);
        localStorage.setItem("userMode", data.user_type);
        
        setUser(updatedUser);
        setModeState(data.user_type);
        
        // Redirect to dashboard
        router.push("/dashboard");
      }
      
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
    // router.push("/login");
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
      if (userData.age_group || userData.ageGroup) {
        localStorage.setItem("userAgeGroup", updatedUser.age_group || updatedUser.ageGroup || "");
      }
      if (userData.mode || userData.user_type) {
        localStorage.setItem("userMode", updatedUser.mode || updatedUser.user_type || "customer");
      }
    }
  };

  if (!isInitialized) {
    return null;
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