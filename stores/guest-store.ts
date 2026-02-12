// stores/guest-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GuestStore {
  isGuest: boolean;
  guestId: string | null;
  
  // Actions
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  clearGuest: () => void;
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set) => ({
      isGuest: false,
      guestId: null,

      enableGuestMode: () => {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        set({
          isGuest: true,
          guestId,
        });
      },

      disableGuestMode: () => {
        set({
          isGuest: false,
          guestId: null,
        });
      },

      clearGuest: () => {
        set({
          isGuest: false,
          guestId: null,
        });
      },
    }),
    {
      name: 'guest-storage',
    }
  )
);

// Guest Feature Dialog Component
export function GuestFeatureDialog() {
  const { enableGuestMode, disableGuestMode } = useGuestStore();
  
  // You can implement this as a reusable dialog component
  return {
    title: 'Guest Mode',
    description: 'You are browsing as a guest. Some features are limited.',
    actions: {
      enableGuest: enableGuestMode,
      disableGuest: disableGuestMode,
    },
  };
}