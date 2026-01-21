"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserMode = "customer" | "professional";

export interface User {
  id: string;
  name: string;
  nameNe: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: string;
  ageGroup?: string;
  isVerified: boolean;
  isProfessionalVerified: boolean;
  mode: UserMode;
}

interface UserContextType {
  user: User | null;
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setModeState] = useState<UserMode>("customer");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const setupComplete = localStorage.getItem("userSetupComplete");
    if (setupComplete) {
      const savedMode = localStorage.getItem("userMode") as UserMode;
      const userName = localStorage.getItem("userName") || "";
      const userPhone = localStorage.getItem("userPhone") || "";
      const userEmail = localStorage.getItem("userEmail") || "";
      const userGender = localStorage.getItem("userGender") || "";
      const userAgeGroup = localStorage.getItem("userAgeGroup") || "";

      setUser({
        id: "user-1",
        name: userName,
        nameNe: userName,
        email: userEmail,
        phone: userPhone,
        gender: userGender,
        ageGroup: userAgeGroup,
        isVerified: true,
        isProfessionalVerified: savedMode === "professional",
        mode: savedMode || "customer",
      });
      setModeState(savedMode || "customer");
    }
    setIsInitialized(true);
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    localStorage.setItem("userMode", newMode);
    if (user) {
      setUser({ ...user, mode: newMode });
    }
  };

  const toggleMode = () => {
    const newMode = mode === "customer" ? "professional" : "customer";
    setMode(newMode);
  };

  const logout = () => {
    localStorage.removeItem("userSetupComplete");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userGender");
    localStorage.removeItem("userAgeGroup");
    localStorage.removeItem("userMode");
    setUser(null);
    setModeState("customer");
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        mode,
        setMode,
        toggleMode,
        isLoggedIn: !!user,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
