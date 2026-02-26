import { create } from 'zustand';
import { User } from '@/lib/data/user';
import { getUserById } from '@/lib/api/user';

interface OtherUserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUserById: (userId: number) => Promise<void>;
  clearUser: () => void;
}

export const useOtherUserStore = create<OtherUserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  fetchUserById: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await getUserById(userId);
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false 
      });
    }
  },
  
  clearUser: () => set({ user: null, error: null }),
}));