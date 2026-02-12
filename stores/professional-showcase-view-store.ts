// stores/professional-showcase-view-store.ts
import { create } from 'zustand';
import { ShowcaseItem } from '@/lib/data/showcase';
import { showcaseApi } from '@/lib/api/showcase';

interface ProfessionalShowcaseViewStore {
  // Cache showcases by professional ID
  showcasesByProfessional: Record<number, ShowcaseItem[]>;
  isLoading: Record<number, boolean>;
  error: Record<number, string | null>;
  lastFetched: Record<number, number>;

  // Actions
  fetchShowcases: (professionalId: number, force?: boolean) => Promise<ShowcaseItem[]>;
  getActiveShowcases: (professionalId: number) => ShowcaseItem[];
  getShowcases: (professionalId: number) => ShowcaseItem[];
  clearCache: () => void;
  clearProfessional: (professionalId: number) => void;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (showcases change less frequently)

export const useProfessionalShowcaseViewStore = create<ProfessionalShowcaseViewStore>((set, get) => ({
  showcasesByProfessional: {},
  isLoading: {},
  error: {},
  lastFetched: {},

  fetchShowcases: async (professionalId: number, force = false) => {
    const state = get();
    const lastFetched = state.lastFetched[professionalId];
    const now = Date.now();

    // Return cached showcases if not expired and not forced
    if (!force && 
        state.showcasesByProfessional[professionalId] && 
        lastFetched && 
        now - lastFetched < CACHE_DURATION) {
      return state.showcasesByProfessional[professionalId];
    }

    // Set loading state
    set({
      isLoading: { ...state.isLoading, [professionalId]: true },
      error: { ...state.error, [professionalId]: null },
    });

    try {
      const showcases = await showcaseApi.getShowcases(professionalId);
      
      set({
        showcasesByProfessional: { ...state.showcasesByProfessional, [professionalId]: showcases },
        isLoading: { ...state.isLoading, [professionalId]: false },
        lastFetched: { ...state.lastFetched, [professionalId]: Date.now() },
      });
      
      return showcases;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch showcases';
      set({
        error: { ...state.error, [professionalId]: errorMessage },
        isLoading: { ...state.isLoading, [professionalId]: false },
        showcasesByProfessional: { ...state.showcasesByProfessional, [professionalId]: [] },
      });
      return [];
    }
  },

  getActiveShowcases: (professionalId: number) => {
    const showcases = get().showcasesByProfessional[professionalId] || [];
    return showcases.filter(s => s.is_active === true);
  },

  getShowcases: (professionalId: number) => {
    return get().showcasesByProfessional[professionalId] || [];
  },

  clearCache: () => {
    set({
      showcasesByProfessional: {},
      isLoading: {},
      error: {},
      lastFetched: {},
    });
  },

  clearProfessional: (professionalId: number) => {
    const state = get();
    const { [professionalId]: _, ...restShowcases } = state.showcasesByProfessional;
    const { [professionalId]: __, ...restLoading } = state.isLoading;
    const { [professionalId]: ___, ...restError } = state.error;
    const { [professionalId]: ____, ...restLastFetched } = state.lastFetched;
    
    set({
      showcasesByProfessional: restShowcases,
      isLoading: restLoading,
      error: restError,
      lastFetched: restLastFetched,
    });
  },
}));