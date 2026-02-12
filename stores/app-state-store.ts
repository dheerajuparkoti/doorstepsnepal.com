// stores/app-state-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStateStore {
  // User state
  userId: number | null;
  userType: 'customer' | 'professional' | 'admin' | null;
  isAuthenticated: boolean;
  
  // App mode
  isProfessionalMode: boolean;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUserId: (userId: number | null) => void;
  setUserType: (userType: 'customer' | 'professional' | 'admin' | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  
  // Mode toggles
  toggleProfessionalMode: () => void;
  setProfessionalMode: (isProfessionalMode: boolean) => void;
  
  // Auth actions
  login: (userId: number, userType: 'customer' | 'professional' | 'admin') => void;
  logout: () => void;
  
  // UI Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Reset
  reset: () => void;
}

export const useAppStateStore = create<AppStateStore>()(
  persist(
    (set) => ({
      // Initial state
      userId: null,
      userType: null,
      isAuthenticated: false,
      isProfessionalMode: false,
      isLoading: false,
      error: null,

      setUserId: (userId) => set({ userId }),
      
      setUserType: (userType) => set({ userType }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      toggleProfessionalMode: () => set((state) => ({ 
        isProfessionalMode: !state.isProfessionalMode 
      })),
      
      setProfessionalMode: (isProfessionalMode) => set({ isProfessionalMode }),
      
      login: (userId, userType) => set({
        userId,
        userType,
        isAuthenticated: true,
        isProfessionalMode: userType === 'professional',
        error: null,
      }),
      
      logout: () => set({
        userId: null,
        userType: null,
        isAuthenticated: false,
        isProfessionalMode: false,
        error: null,
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      reset: () => set({
        userId: null,
        userType: null,
        isAuthenticated: false,
        isProfessionalMode: false,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'app-state-storage',
      partialize: (state) => ({
        userId: state.userId,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated,
        isProfessionalMode: state.isProfessionalMode,
      }),
    }
  )
);