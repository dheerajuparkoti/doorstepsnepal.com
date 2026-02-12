// stores/professional-services-view-store.ts
import { create } from 'zustand';
import { ProfessionalService } from '@/lib/data/professional-services';
import { fetchServicesByProfessionalId } from '@/lib/api/professional-services';

interface ProfessionalServicesViewStore {
  // Cache services by professional ID
  servicesByProfessional: Record<number, ProfessionalService[]>;
  isLoading: Record<number, boolean>;
  error: Record<number, string | null>;
  lastFetched: Record<number, number>;

  // Actions
  fetchServicesByProfessional: (professionalId: number, force?: boolean) => Promise<ProfessionalService[]>;
  getServicesByProfessional: (professionalId: number) => ProfessionalService[];
  clearCache: () => void;
  clearProfessional: (professionalId: number) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfessionalServicesViewStore = create<ProfessionalServicesViewStore>((set, get) => ({
  servicesByProfessional: {},
  isLoading: {},
  error: {},
  lastFetched: {},

  fetchServicesByProfessional: async (professionalId: number, force = false) => {
    const state = get();
    const lastFetched = state.lastFetched[professionalId];
    const now = Date.now();

    // Return cached services if not expired and not forced
    if (!force && 
        state.servicesByProfessional[professionalId] && 
        lastFetched && 
        now - lastFetched < CACHE_DURATION) {
      return state.servicesByProfessional[professionalId];
    }

    // Set loading state
    set({
      isLoading: { ...state.isLoading, [professionalId]: true },
      error: { ...state.error, [professionalId]: null },
    });

    try {
      const services = await fetchServicesByProfessionalId(professionalId);
      
      set({
        servicesByProfessional: { ...state.servicesByProfessional, [professionalId]: services },
        isLoading: { ...state.isLoading, [professionalId]: false },
        lastFetched: { ...state.lastFetched, [professionalId]: Date.now() },
      });
      
      return services;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch professional services';
      set({
        error: { ...state.error, [professionalId]: errorMessage },
        isLoading: { ...state.isLoading, [professionalId]: false },
        servicesByProfessional: { ...state.servicesByProfessional, [professionalId]: [] },
      });
      return [];
    }
  },

  getServicesByProfessional: (professionalId: number) => {
    return get().servicesByProfessional[professionalId] || [];
  },

  clearCache: () => {
    set({
      servicesByProfessional: {},
      isLoading: {},
      error: {},
      lastFetched: {},
    });
  },

  clearProfessional: (professionalId: number) => {
    const state = get();
    const { [professionalId]: _, ...restServices } = state.servicesByProfessional;
    const { [professionalId]: __, ...restLoading } = state.isLoading;
    const { [professionalId]: ___, ...restError } = state.error;
    const { [professionalId]: ____, ...restLastFetched } = state.lastFetched;
    
    set({
      servicesByProfessional: restServices,
      isLoading: restLoading,
      error: restError,
      lastFetched: restLastFetched,
    });
  },
}));