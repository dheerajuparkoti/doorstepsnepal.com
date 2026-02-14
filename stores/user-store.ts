import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/data/user';
import { getUserProfile } from '@/lib/api/user';
import { refreshTokenRegistration, unregisterToken } from '@/app/notifications/fcm-web';

interface UserState {
  user: User | null; 
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  setUser: (user: User | null) => void; 
  updateUser: (updates: Partial<User>) => void; 
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      // setUser: (user) => set({ 
      //   user, 
      //   error: null,
      //   isInitialized: true 
      // }),

       setUser: (user) => { 
        set({ 
          user, 
          error: null,
          isInitialized: true 
        });
        
        // When user is set (login), register FCM token
        if (user?.id && typeof window !== 'undefined') {
          console.log("🔔 User logged in, registering FCM token");
          // Small delay to ensure store is updated
          setTimeout(() => {
            refreshTokenRegistration();
          }, 500);
        }
      },

      

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
          error: null,
        })),

      // clearUser: () => set({ 
      //   user: null, 
      //   error: null,
      //   isInitialized: true 
      // }),

        clearUser: async () => { 
        // When user logs out, unregister token from server
        if (typeof window !== 'undefined') {
          console.log("🚪 User logging out, unregistering FCM token");
          await unregisterToken();
        }
        
        set({ 
          user: null, 
          error: null,
          isInitialized: true 
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      refreshUser: async () => {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          set({ error: 'No authentication token found' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          await getUserProfile(); //updates Zustand automatically
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh user',
            isLoading: false 
          });
          throw error; // Re-throw so components can handle it
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isInitialized: state.isInitialized 
      }),
    }
  )
);

export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);

// Don't create new object on every render - use individual hooks instead
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useUpdateUser = () => useUserStore((state) => state.updateUser);
export const useClearUser = () => useUserStore((state) => state.clearUser);
export const useRefreshUser = () => useUserStore((state) => state.refreshUser);