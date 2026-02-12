// stores/professional-view-store.ts
import { create } from 'zustand';
import { ProfessionalProfile } from '@/lib/data/professional';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';

interface ProfessionalViewStore {
  // Cache profiles by ID
  profiles: Record<number, ProfessionalProfile>;
  currentProfessionalId: number | null;
  isLoading: Record<number, boolean>;
  error: Record<number, string | null>;
  lastFetched: Record<number, number>; // timestamp for cache invalidation
  
  // Actions
  fetchProfessional: (professionalId: number, force?: boolean) => Promise<ProfessionalProfile | null>;
  getProfessional: (professionalId: number) => ProfessionalProfile | null;
  clearCache: () => void;
  clearProfessional: (professionalId: number) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfessionalViewStore = create<ProfessionalViewStore>((set, get) => ({
  profiles: {},
  currentProfessionalId: null,
  isLoading: {},
  error: {},
  lastFetched: {},

  fetchProfessional: async (professionalId: number, force = false) => {
    const state = get();
    const lastFetched = state.lastFetched[professionalId];
    const now = Date.now();
    
    // Return cached profile if not expired and not forced
    if (!force && 
        state.profiles[professionalId] && 
        lastFetched && 
        now - lastFetched < CACHE_DURATION) {
      return state.profiles[professionalId];
    }

    // Set loading state
    set({
      isLoading: { ...state.isLoading, [professionalId]: true },
      error: { ...state.error, [professionalId]: null },
      currentProfessionalId: professionalId,
    });

    try {
      const profile = await fetchProfessionalProfile(professionalId);
      
      if (profile) {
        set({
          profiles: { ...state.profiles, [professionalId]: profile },
          isLoading: { ...state.isLoading, [professionalId]: false },
          lastFetched: { ...state.lastFetched, [professionalId]: Date.now() },
        });
        return profile;
      } else {
        throw new Error('Professional not found');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch professional profile';
      set({
        error: { ...state.error, [professionalId]: errorMessage },
        isLoading: { ...state.isLoading, [professionalId]: false },
      });
      return null;
    }
  },

  getProfessional: (professionalId: number) => {
    return get().profiles[professionalId] || null;
  },

  clearCache: () => {
    set({
      profiles: {},
      currentProfessionalId: null,
      isLoading: {},
      error: {},
      lastFetched: {},
    });
  },

  clearProfessional: (professionalId: number) => {
    const state = get();
    const { [professionalId]: _, ...restProfiles } = state.profiles;
    const { [professionalId]: __, ...restLoading } = state.isLoading;
    const { [professionalId]: ___, ...restError } = state.error;
    const { [professionalId]: ____, ...restLastFetched } = state.lastFetched;
    
    set({
      profiles: restProfiles,
      isLoading: restLoading,
      error: restError,
      lastFetched: restLastFetched,
    });
  },
}));