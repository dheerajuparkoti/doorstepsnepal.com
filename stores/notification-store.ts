
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import { devtools } from 'zustand/middleware';
import { Notification } from '@/lib/data/notification';
import { notificationApi } from '@/lib/api/notification';
import { useUserStore } from './user-store';
import { NepaliDateService } from '@/lib/utils/nepaliDate'; 

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
  addNotification: (notification: Notification) => void;
}


const parseNepaliDate = (dateStr: string): number => {
  try {
    const nepaliDate = NepaliDateService.toBS(dateStr);
    if (!nepaliDate) return 0;
    

    const year = nepaliDate.getYear();
    const month = nepaliDate.getMonth() + 1;
    const day = nepaliDate.getDate();
    

    const [datePart, timePart] = dateStr.split(' ');
    let hours = 0, minutes = 0, seconds = 0;
    
    if (timePart) {
      const [h, m, s] = timePart.split(':').map(Number);
      hours = h || 0;
      minutes = m || 0;
      seconds = s || 0;
    }
    
    // Create a sortable number: YYYYMMDDHHMMSS
    return year * 10000000000 + month * 100000000 + day * 1000000 + hours * 10000 + minutes * 100 + seconds;
  } catch (error) {
    console.error('Error parsing Nepali date:', error);
    return 0;
  }
};


const sortNotificationsByDate = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => {
    const dateA = parseNepaliDate(a.created_at);
    const dateB = parseNepaliDate(b.created_at);
    return dateB - dateA; 
  });
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    devtools(
      (set, get) => ({
        notifications: [],
        currentNotification: null,
        isLoading: false,
        error: null,
        lastFetched: null,


        get unreadCount() {
          const count = get().notifications.filter(n => !n.is_read).length;
          return count;
        },

      hasOtherModeNotifications: (isProfessionalMode: boolean) => {
  return get().notifications.filter(notif => {
  
    const isProNotif = 
      notif.type === 'New Order' ||
      notif.type === 'payment_received' ||
      notif.type === 'withdrawal_approved' ||
      notif.type === 'withdrawal_completed' ||
      notif.type === 'withdrawal_rejected' ||
      (notif.type === 'Order Update' && 
       (notif.title === 'Inspection Approved' || 
        notif.title === 'Inspection Rejected'|| notif.title === 'Order Cancelled'));
    

    const isTargetMode = isProfessionalMode ? !isProNotif : isProNotif;
    
    return isTargetMode && !notif.is_read;
  }).length;
},

    
        addNotification: (notification: Notification) => {
          set((state) => {
        
            const exists = state.notifications.some(n => n.id === notification.id);
            if (exists) {
              return state;
            }
            

            const updatedNotifications = [notification, ...state.notifications];
            return { 
              notifications: sortNotificationsByDate(updatedNotifications)
            };
          });
        },

        loadNotifications: async (force = false) => {
          const state = get();
          const now = Date.now();
          const CACHE_DURATION = 5 * 60 * 1000; 
          
          // Check cache
          if (!force && 
              state.lastFetched && 
              (now - state.lastFetched) < CACHE_DURATION &&
              state.notifications.length > 0) {
            
   
            if (!sortNotificationsByDate(state.notifications).every((n, i) => n.id === state.notifications[i]?.id)) {
              set({ notifications: sortNotificationsByDate(state.notifications) });
            }
            return;
          }

          set({ isLoading: true, error: null });
          
          try {
            const notifications = await notificationApi.getMyNotifications();
        
            const sortedNotifications = sortNotificationsByDate(notifications);
   
            console.log('Sorted notifications:', sortedNotifications.map(n => ({
              id: n.id,
              created_at: n.created_at,
              title: n.title
            })));
            
            set({ 
              notifications: sortedNotifications, 
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
            
            set((state) => {
              const updatedNotifications = state.notifications.map(n => 
                n.id === id ? updated : n
              );
              return {
                notifications: sortNotificationsByDate(updatedNotifications)
              };
            });

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
            
            set((state) => {
              const updatedNotifications = state.notifications.map(n => ({ ...n, is_read: true }));
              return {
                notifications: sortNotificationsByDate(updatedNotifications)
              };
            });
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

            set((state) => {
              // Add new notification and sort
              const updatedNotifications = [notification, ...state.notifications];
              return {
                notifications: sortNotificationsByDate(updatedNotifications)
              };
            });

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

export const useNotifications = () => {
  const notifications = useNotificationStore(state => state.notifications);
  return notifications;
};

export const useIsLoading = () => useNotificationStore(state => state.isLoading);
export const useLastFetched = () => useNotificationStore(state => state.lastFetched);