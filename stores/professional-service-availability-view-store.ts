// stores/service-availability-view-store.ts
import { create } from 'zustand';
import { ServiceAvailability } from '@/lib/data/service-availability';
import { serviceAvailabilityApi } from '@/lib/api/service-availability';

interface ServiceAvailabilityViewStore {
  // Cache availabilities by professional ID
  availabilitiesByProfessional: Record<number, ServiceAvailability[]>;
  isLoading: Record<number, boolean>;
  error: Record<number, string | null>;
  lastFetched: Record<number, number>;

  // Helper functions
  formatTimeForDisplay: (timeString: string) => string;
  getDayNameInNepali: (day: string) => string;
  daysOfWeek: string[];

  // Actions
  fetchAvailabilities: (professionalId: number, force?: boolean) => Promise<ServiceAvailability[]>;
  getAvailabilities: (professionalId: number) => ServiceAvailability[];
  getAvailabilitiesByDay: (professionalId: number, day: string) => ServiceAvailability[];
  clearCache: () => void;
  clearProfessional: (professionalId: number) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const useServiceAvailabilityViewStore = create<ServiceAvailabilityViewStore>((set, get) => ({
  availabilitiesByProfessional: {},
  isLoading: {},
  error: {},
  lastFetched: {},
  
  daysOfWeek: DAYS_OF_WEEK,

  formatTimeForDisplay: (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  getDayNameInNepali: (day: string) => {
    const dayMap: Record<string, string> = {
      'Sunday': 'आइतबार',
      'Monday': 'सोमबार',
      'Tuesday': 'मङ्गलबार',
      'Wednesday': 'बुधबार',
      'Thursday': 'बिहिबार',
      'Friday': 'शुक्रबार',
      'Saturday': 'शनिबार',
    };
    return dayMap[day] || day;
  },

  fetchAvailabilities: async (professionalId: number, force = false) => {
    const state = get();
    const lastFetched = state.lastFetched[professionalId];
    const now = Date.now();

    if (!force && 
        state.availabilitiesByProfessional[professionalId] && 
        lastFetched && 
        now - lastFetched < CACHE_DURATION) {
      return state.availabilitiesByProfessional[professionalId];
    }

    set({
      isLoading: { ...state.isLoading, [professionalId]: true },
      error: { ...state.error, [professionalId]: null },
    });

    try {
      const response = await serviceAvailabilityApi.getServiceAvailabilities(professionalId, {
        limit: 100,
      });
      
      set({
        availabilitiesByProfessional: { 
          ...state.availabilitiesByProfessional, 
          [professionalId]: response.items 
        },
        isLoading: { ...state.isLoading, [professionalId]: false },
        lastFetched: { ...state.lastFetched, [professionalId]: Date.now() },
      });
      
      return response.items;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch availabilities';
      set({
        error: { ...state.error, [professionalId]: errorMessage },
        isLoading: { ...state.isLoading, [professionalId]: false },
        availabilitiesByProfessional: { ...state.availabilitiesByProfessional, [professionalId]: [] },
      });
      return [];
    }
  },

  getAvailabilities: (professionalId: number) => {
    return get().availabilitiesByProfessional[professionalId] || [];
  },

  getAvailabilitiesByDay: (professionalId: number, day: string) => {
    const availabilities = get().availabilitiesByProfessional[professionalId] || [];
    return availabilities.filter(a => a.day_of_week === day);
  },

  clearCache: () => {
    set({
      availabilitiesByProfessional: {},
      isLoading: {},
      error: {},
      lastFetched: {},
    });
  },

  clearProfessional: (professionalId: number) => {
    const state = get();
    const { [professionalId]: _, ...restAvailabilities } = state.availabilitiesByProfessional;
    const { [professionalId]: __, ...restLoading } = state.isLoading;
    const { [professionalId]: ___, ...restError } = state.error;
    const { [professionalId]: ____, ...restLastFetched } = state.lastFetched;
    
    set({
      availabilitiesByProfessional: restAvailabilities,
      isLoading: restLoading,
      error: restError,
      lastFetched: restLastFetched,
    });
  },
}));