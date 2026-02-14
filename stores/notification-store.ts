// stores/notification-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import { devtools } from 'zustand/middleware';
import { Notification } from '@/lib/data/notification';
import { notificationApi } from '@/lib/api/notification';
import { useUserStore } from './user-store';

interface NotificationState {
  // Data
  notifications: Notification[];
  currentNotification: Notification | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; 
  
  // Computed
  unreadCount: number; 
  hasOtherModeNotifications: (isProfessionalMode: boolean) => number;
  
  // Actions
  loadNotifications: (force?: boolean) => Promise<void>;
  getNotificationById: (id: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  createNotification: (data: any) => Promise<Notification | null>;
  clearError: () => void;
  clearNotifications: () => void; 
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    devtools(
      (set, get) => ({
        notifications: [],
        currentNotification: null,
        isLoading: false,
        error: null,
        lastFetched: null,

        // Computed
        get unreadCount() {
          const count = get().notifications.filter(n => !n.is_read).length;
          return count;
        },

        hasOtherModeNotifications: (isProfessionalMode: boolean) => {
          return get().notifications.filter(notif => {
            const isProNotif = ['New Order', 'payment_received', 'withdrawal_approved', 
                                'withdrawal_completed', 'withdrawal_rejected'].includes(notif.type);
            return isProfessionalMode ? !isProNotif : isProNotif;
          }).filter(notif => !notif.is_read).length;
        },

        // Load all notifications with caching
        loadNotifications: async (force = false) => {
          const state = get();
          const now = Date.now();
          const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
          

          if (!force && 
              state.lastFetched && 
              (now - state.lastFetched) < CACHE_DURATION &&
              state.notifications.length > 0) {
    
            return;
          }

   
          set({ isLoading: true, error: null });
          
          try {
            const notifications = await notificationApi.getMyNotifications();

            
            notifications.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            
            set({ 
              notifications, 
              lastFetched: now,
              isLoading: false 
            });
            
          } catch (error) {
  
            set({ 
              error: error instanceof Error ? error.message : 'Failed to load notifications',
              isLoading: false 
            });
          }
        },

        // Get single notification
        getNotificationById: async (id: number) => {
          set({ isLoading: true, error: null });
          try {
            const notification = await notificationApi.getNotificationById(id);
            set({ currentNotification: notification });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to load notification' });
          } finally {
            set({ isLoading: false });
          }
        },

        // Mark as read
        markAsRead: async (id: number) => {
          try {
            const updated = await notificationApi.patchNotification(id, { is_read: true });
            
            set((state) => ({
              notifications: state.notifications.map(n => n.id === id ? updated : n)
            }));

            const current = get().currentNotification;
            if (current?.id === id) {
              set({ currentNotification: updated });
            }
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to mark as read' });
          }
        },

        // Mark all as read
        markAllAsRead: async () => {
          try {
            const unreadIds = get().notifications.filter(n => !n.is_read).map(n => n.id);
            await Promise.all(unreadIds.map(id => 
              notificationApi.patchNotification(id, { is_read: true })
            ));
            
            set((state) => ({
              notifications: state.notifications.map(n => ({ ...n, is_read: true }))
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to mark all as read' });
          }
        },

        // Delete notification
        deleteNotification: async (id: number) => {
          try {
            await notificationApi.deleteNotification(id);
            set((state) => ({
              notifications: state.notifications.filter(n => n.id !== id),
              currentNotification: state.currentNotification?.id === id ? null : state.currentNotification
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete notification' });
          }
        },

        // Create notification
        createNotification: async (data) => {
          try {
            const { user } = useUserStore.getState();
            if (!user?.id) return null;

            const notification = await notificationApi.createNotification({
              user_id: user.id,
              ...data
            });

            set((state) => ({
              notifications: [notification, ...state.notifications]
            }));

            return notification;
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create notification' });
            return null;
          }
        },

        // Clear notifications (on logout)
        clearNotifications: () => {
          set({ 
            notifications: [], 
            currentNotification: null,
            lastFetched: null 
          });
        },

        clearError: () => set({ error: null }),
      }),
      { name: 'notification-store' }
    ),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        notifications: state.notifications,
        lastFetched: state.lastFetched 
      }), 
    }
  )
);

// Selector hooks
export const useUnreadCount = () => {
  return useNotificationStore(state => state.notifications.filter(n => !n.is_read).length);
};

export const useNotifications = () => useNotificationStore(state => state.notifications);
export const useIsLoading = () => useNotificationStore(state => state.isLoading);
export const useLastFetched = () => useNotificationStore(state => state.lastFetched);