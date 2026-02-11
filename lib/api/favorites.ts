import { api } from '@/config/api-client';
import { FavoritesResponse } from '@/lib/data/favorites';

export async function fetchFavorites(): Promise<FavoritesResponse> {
  try {
    return await api.get<FavoritesResponse>('/favorites/', {
      cache: 'no-store', 
    });
  } catch (error) {
    console.error('API Error fetching favorites:', error);
    return [];
  }
}

export async function addFavorite(data: {
  professional_id?: number;
  professional_service_id?: number;
}): Promise<any> {
  return await api.post('/favorites', data);
}

export async function removeFavorite(favoriteId: number): Promise<any> {
  return await api.delete(`/favorites/${favoriteId}`);
}