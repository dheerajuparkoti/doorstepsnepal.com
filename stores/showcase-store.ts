// stores/showcase-store.ts
import { create } from 'zustand';
import { ShowcaseItem, ShowcaseStatus } from '@/lib/data/showcase';
import { showcaseApi } from '@/lib/api/showcase';

interface ShowcaseStore {
  showcases: ShowcaseItem[];
  isLoading: boolean;
  error: string | null;
  isUploading: boolean;
  isDeleting: boolean;
  isToggling: boolean;
  
  fetchShowcases: (professionalId: number) => Promise<void>;
  uploadShowcase: (professionalId: number, file: File, description?: string) => Promise<ShowcaseItem>;
  updateShowcase: (professionalId: number, showcaseId: number, file: File | null, description?: string) => Promise<ShowcaseItem>;
  deleteShowcase: (professionalId: number, showcaseId: number) => Promise<void>;
  toggleShowcaseActive: (professionalId: number, showcaseId: number, isActive: boolean) => Promise<ShowcaseItem>;
  clearError: () => void;
  clearShowcases: () => void;
}

export const useShowcaseStore = create<ShowcaseStore>((set, get) => ({
  // Initial state
  showcases: [],
  isLoading: false,
  error: null,
  isUploading: false,
  isDeleting: false,
  isToggling: false,

  // Fetch all showcases for a professional
  fetchShowcases: async (professionalId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const showcases = await showcaseApi.getShowcases(professionalId);
      
      set({ 
        showcases: showcases,
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch showcases';
      set({ 
        error: errorMessage, 
        isLoading: false,
        showcases: [] 
      });
    }
  },

  // Upload a new showcase
  uploadShowcase: async (professionalId: number, file: File, description?: string) => {
    set({ isUploading: true, error: null });
    try {
      const newShowcase = await showcaseApi.uploadShowcase(professionalId, {
        file,
        description,
      });
      
      set(state => ({
        showcases: [...state.showcases, newShowcase],
        isUploading: false,
      }));
      
      return newShowcase;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload showcase';
      set({ 
        error: errorMessage, 
        isUploading: false 
      });
      throw error;
    }
  },

  // Update an existing showcase
  updateShowcase: async (professionalId: number, showcaseId: number, file: File | null, description?: string) => {
    set({ isUploading: true, error: null });
    try {
      const updatedShowcase = await showcaseApi.updateShowcase(
        professionalId,
        showcaseId,
        {
          file,
          description,
          status: ShowcaseStatus.PENDING, // Reset to pending on update
          reason: null, // Clear any previous rejection reason
        }
      );
      
      set(state => ({
        showcases: state.showcases.map(showcase => 
          showcase.id === showcaseId ? updatedShowcase : showcase
        ),
        isUploading: false,
      }));
      
      return updatedShowcase;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update showcase';
      set({ 
        error: errorMessage, 
        isUploading: false 
      });
      throw error;
    }
  },

  // Delete a showcase
  deleteShowcase: async (professionalId: number, showcaseId: number) => {
    set({ isDeleting: true, error: null });
    try {
      await showcaseApi.deleteShowcase(professionalId, showcaseId);
      
      set(state => ({
        showcases: state.showcases.filter(showcase => showcase.id !== showcaseId),
        isDeleting: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete showcase';
      set({ 
        error: errorMessage, 
        isDeleting: false 
      });
      throw error;
    }
  },

  // Toggle showcase active status
  toggleShowcaseActive: async (professionalId: number, showcaseId: number, isActive: boolean) => {
    set({ isToggling: true, error: null });
    try {
      const updatedShowcase = await showcaseApi.toggleShowcaseActive(
        professionalId,
        showcaseId,
        isActive
      );
      
      set(state => ({
        showcases: state.showcases.map(showcase => 
          showcase.id === showcaseId ? updatedShowcase : showcase
        ),
        isToggling: false,
      }));
      
      return updatedShowcase;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle showcase status';
      set({ 
        error: errorMessage, 
        isToggling: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear all showcases
  clearShowcases: () => set({ showcases: [] }),
}));