// stores/favorite-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addFavorite, removeFavorite, fetchFavorites } from '@/lib/api/favorites';
import type { Favorite, FavoritesResponse } from '@/lib/data/favorites';
import { toast } from 'sonner';

export interface FavoriteItem {
  id: number;
  professional_id?: number;
  professional_service_id?: number;
  professional_name?: string;
  service_name?: string;
  service_name_np?: string;
  professional_image?: string;
  service_image?: string;
  price?: number;
  created_at: string;
}

interface FavoriteStore {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchFavorites: (force?: boolean) => Promise<void>;
  addToFavorites: (data: {
    professional_id?: number;
    professional_service_id?: number;
    professional_name?: string;
    professional_image?: string;
    service_name?: string;
    service_name_np?: string;
    service_image?: string;
    price?: number;
  }) => Promise<void>;
  addToFavoritesQuick: (data: {
    professionalId: number;
    professionalName: string;
    professionalImage?: string;
    serviceName?: string | null;
    serviceNameNp?: string | null;
    serviceImage?: string | null;
    price?: number;
    professionalServiceId?: number | null;
  }) => Promise<void>;
  removeFromFavorites: (favoriteId: number) => Promise<void>;
  isFavorite: (professionalId?: number, professionalServiceId?: number) => boolean;
  getFavoriteId: (professionalId?: number, professionalServiceId?: number) => number | null;
  clearFavorites: () => void;
  clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  isLoading: false,
  isAdding: false,
  isRemoving: false,
  error: null,
  lastFetched: null,

  fetchFavorites: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    if (!force && 
        state.favorites.length > 0 && 
        state.lastFetched && 
        now - state.lastFetched < CACHE_DURATION) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const favorites = await fetchFavorites();
      
      // Transform API response to FavoriteItem[]
      const favoriteItems: FavoriteItem[] = favorites.map((fav: Favorite) => {
        if (fav.professional_service_id && fav.professional_service) {
          // This is a service favorite
          return {
            id: fav.id,
            professional_service_id: fav.professional_service_id,
            professional_id: fav.professional_id,
            professional_name: fav.professional_service?.full_name || fav.professional?.full_name,
            professional_image: fav.professional_service?.image || fav.professional?.profile_image,
            service_name: fav.professional_service?.service_name_en,
            service_name_np: fav.professional_service?.service_name_np,
            service_image: fav.professional_service?.image,
            price: fav.professional_service?.price,
            created_at: fav.professional_service?.created_at || new Date().toISOString(),
          };
        } else {
          // This is a professional favorite
          return {
            id: fav.id,
            professional_id: fav.professional_id,
            professional_name: fav.professional?.full_name,
            professional_image: fav.professional?.profile_image,
            created_at: new Date().toISOString(),
          };
        }
      });

      set({
        favorites: favoriteItems,
        isLoading: false,
        lastFetched: Date.now(),
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch favorites';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  addToFavorites: async (data) => {
    set({ isAdding: true, error: null });

    try {
      const newFavorite = await addFavorite({
        professional_id: data.professional_id,
        professional_service_id: data.professional_service_id,
      }) as Favorite;

      const favoriteItem: FavoriteItem = {
        id: newFavorite.id,
        professional_id: newFavorite.professional_id,
        professional_service_id: newFavorite.professional_service_id,
        professional_name: data.professional_name || newFavorite.professional?.full_name,
        professional_image: data.professional_image || newFavorite.professional?.profile_image,
        service_name: data.service_name || newFavorite.professional_service?.service_name_en,
        service_name_np: data.service_name_np || newFavorite.professional_service?.service_name_np,
        service_image: data.service_image || newFavorite.professional_service?.image,
        price: data.price || newFavorite.professional_service?.price,
        created_at: newFavorite.professional_service?.created_at || new Date().toISOString(),
      };

      set((state) => ({
        favorites: [favoriteItem, ...state.favorites],
        isAdding: false,
      }));

      toast.success(
        data.service_name 
          ? `${data.professional_name} - ${data.service_name} added to favorites`
          : `${data.professional_name} added to favorites`
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add to favorites';
      set({ error: errorMessage, isAdding: false });
      toast.error('Failed to add to favorites');
      throw error;
    }
  },

  addToFavoritesQuick: async ({
    professionalId,
    professionalName,
    professionalImage,
    serviceName,
    serviceNameNp,
    serviceImage,
    price,
    professionalServiceId,
  }) => {
    set({ isAdding: true, error: null });

    try {
      const newFavorite = await addFavorite({
        professional_id: professionalId,
        professional_service_id: professionalServiceId || undefined,
      }) as Favorite;

      const favoriteItem: FavoriteItem = {
        id: newFavorite.id,
        professional_id: professionalId,
        professional_service_id: professionalServiceId || undefined,
        professional_name: professionalName,
        professional_image: professionalImage,
        service_name: serviceName || undefined,
        service_name_np: serviceNameNp || undefined,
        service_image: serviceImage || undefined,
        price: price,
        created_at: newFavorite.professional_service?.created_at || new Date().toISOString(),
      };

      set((state) => ({
        favorites: [favoriteItem, ...state.favorites],
        isAdding: false,
      }));

      toast.success(
        serviceName 
          ? `${professionalName} - ${serviceName} added to favorites`
          : `${professionalName} added to favorites`
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add to favorites';
      set({ error: errorMessage, isAdding: false });
      toast.error('Failed to add to favorites');
      throw error;
    }
  },

  removeFromFavorites: async (favoriteId: number) => {
    set({ isRemoving: true, error: null });

    try {
      await removeFavorite(favoriteId);

      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.id !== favoriteId),
        isRemoving: false,
      }));

      toast.success('Removed from favorites');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to remove from favorites';
      set({ error: errorMessage, isRemoving: false });
      toast.error('Failed to remove from favorites');
      throw error;
    }
  },

  isFavorite: (professionalId?: number, professionalServiceId?: number) => {
    const state = get();
    
    if (professionalServiceId) {
      return state.favorites.some(
        (fav) => fav.professional_service_id === professionalServiceId
      );
    }
    
    if (professionalId) {
      return state.favorites.some(
        (fav) => fav.professional_id === professionalId && !fav.professional_service_id
      );
    }
    
    return false;
  },

  getFavoriteId: (professionalId?: number, professionalServiceId?: number) => {
    const state = get();
    
    if (professionalServiceId) {
      const fav = state.favorites.find(
        (fav) => fav.professional_service_id === professionalServiceId
      );
      return fav?.id || null;
    }
    
    if (professionalId) {
      const fav = state.favorites.find(
        (fav) => fav.professional_id === professionalId && !fav.professional_service_id
      );
      return fav?.id || null;
    }
    
    return null;
  },

  clearFavorites: () => {
    set({
      favorites: [],
      lastFetched: null,
    });
  },

  clearError: () => set({ error: null }),
}));