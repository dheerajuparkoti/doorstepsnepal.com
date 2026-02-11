import { create } from 'zustand';
import {
  ServiceAvailability,
  ServiceAvailabilityCreateData,
  ServiceAvailabilityUpdateData,
  DAYS_OF_WEEK,
  MAX_AVAILABILITY_SLOTS,
  formatTimeForDisplay,
  getDayNameInNepali,
} from '@/lib/data/service-availability';
import { serviceAvailabilityApi } from '@/lib/api/service-availability';

interface ServiceAvailabilityStore {
  // State
  availabilities: ServiceAvailability[];
  isLoading: boolean;
  isLoadingAvailabilities: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Form state
  selectedDay: string;
  startTime: Date | null;
  endTime: Date | null;
  
  // Available days (excluding already used days)
  availableDays: string[];
  
  // Constants
  daysOfWeek: string[];
  maxSlots: number;
  
  // Actions
  setSelectedDay: (day: string) => void;
  setStartTime: (time: Date | null) => void;
  setEndTime: (time: Date | null) => void;
  resetForm: () => void;
  
  fetchAvailabilities: (professionalId: number) => Promise<void>;
  createAvailability: (data: ServiceAvailabilityCreateData) => Promise<ServiceAvailability>;
  updateAvailability: (availabilityId: number, data: ServiceAvailabilityUpdateData) => Promise<ServiceAvailability>;
  deleteAvailability: (availabilityId: number) => Promise<void>;
  
  clearError: () => void;
  clearAvailabilities: () => void;
}

export const useServiceAvailabilityStore = create<ServiceAvailabilityStore>((set, get) => ({
  // Initial state
  availabilities: [],
  isLoading: false,
  isLoadingAvailabilities: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  
  // Form initial state
  selectedDay: DAYS_OF_WEEK[0], // Default to Sunday
  startTime: null,
  endTime: null,
  
  // Available days (will be calculated)
  availableDays: DAYS_OF_WEEK,
  
  // Constants
  daysOfWeek: DAYS_OF_WEEK,
  maxSlots: MAX_AVAILABILITY_SLOTS,

  // Form actions
  setSelectedDay: (day: string) => {
    set({ selectedDay: day });
  },

  setStartTime: (time: Date | null) => {
    set({ startTime: time });
  },

  setEndTime: (time: Date | null) => {
    set({ endTime: time });
  },

  resetForm: () => {
    set({
      selectedDay: DAYS_OF_WEEK[0],
      startTime: null,
      endTime: null,
    });
  },

  // Fetch professional's service availabilities
  fetchAvailabilities: async (professionalId: number) => {
    set({ isLoadingAvailabilities: true, error: null });
    
    try {
      const response = await serviceAvailabilityApi.getServiceAvailabilities(professionalId, {
        limit: 100, // Get all availabilities
      });
      
      // Update available days (days not already used)
      const usedDays = new Set(response.items.map(item => item.day_of_week));
      const availableDays = DAYS_OF_WEEK.filter(day => !usedDays.has(day));
      
      set({
        availabilities: response.items,
        availableDays,
        isLoadingAvailabilities: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch availabilities';
      set({
        error: errorMessage,
        isLoadingAvailabilities: false,
        availabilities: [],
        availableDays: DAYS_OF_WEEK,
      });
    }
  },

  // Create new service availability
  createAvailability: async (data: ServiceAvailabilityCreateData) => {
    set({ isUpdating: true, error: null });
    
    try {
      // Check if slot limit reached
      const currentCount = get().availabilities.length;
      if (currentCount >= get().maxSlots) {
        throw new Error('Maximum number of time slots reached');
      }
      
      // Check if day already has a slot
      const dayAlreadyExists = get().availabilities.some(
        item => item.day_of_week === data.day_of_week
      );
      if (dayAlreadyExists) {
        throw new Error('Time slot already exists for this day');
      }
      
      const newAvailability = await serviceAvailabilityApi.createServiceAvailability(data);
      
      // Update state
      const updatedAvailabilities = [...get().availabilities, newAvailability];
      const usedDays = new Set(updatedAvailabilities.map(item => item.day_of_week));
      const availableDays = DAYS_OF_WEEK.filter(day => !usedDays.has(day));
      
      set(state => ({
        availabilities: updatedAvailabilities,
        availableDays,
        isUpdating: false,
        selectedDay: availableDays[0] || state.selectedDay,
        startTime: null,
        endTime: null,
      }));
      
      return newAvailability;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create availability';
      set({
        error: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Update existing service availability
  updateAvailability: async (availabilityId: number, data: ServiceAvailabilityUpdateData) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updatedAvailability = await serviceAvailabilityApi.updateServiceAvailability(availabilityId, data);
      
      // Update state
      set(state => ({
        availabilities: state.availabilities.map(item =>
          item.id === availabilityId ? updatedAvailability : item
        ),
        isUpdating: false,
      }));
      
      return updatedAvailability;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update availability';
      set({
        error: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Delete service availability
  deleteAvailability: async (availabilityId: number) => {
    set({ isDeleting: true, error: null });
    
    try {
      await serviceAvailabilityApi.deleteServiceAvailability(availabilityId);
      
      // Update state
      const updatedAvailabilities = get().availabilities.filter(item => item.id !== availabilityId);
      const usedDays = new Set(updatedAvailabilities.map(item => item.day_of_week));
      const availableDays = DAYS_OF_WEEK.filter(day => !usedDays.has(day));
      
      set({
        availabilities: updatedAvailabilities,
        availableDays,
        isDeleting: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete availability';
      set({
        error: errorMessage,
        isDeleting: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear availabilities
  clearAvailabilities: () => set({
    availabilities: [],
    availableDays: DAYS_OF_WEEK,
    selectedDay: DAYS_OF_WEEK[0],
    startTime: null,
    endTime: null,
  }),
}));