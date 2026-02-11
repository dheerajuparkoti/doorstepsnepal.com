
import { api } from '@/config/api-client';
import { ShowcaseItem, ShowcaseFormData, ShowcasePatchData } from '@/lib/data/showcase';

export const showcaseApi = {
  // Get all showcases for a professional
  async getShowcases(professionalId: number): Promise<ShowcaseItem[]> {
    try {
      const endpoint = `/professional-showcase/${professionalId}/showcases`;
      const response = await api.get<any>(endpoint);
      
      // API returns a direct array, so response should be the array
      if (Array.isArray(response)) {
        return response;
      }
      
      // If response is an object that contains an array
      if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response.showcases)) {
          return response.showcases;
        }
        if (Array.isArray(response.results)) {
          return response.results;
        }
      }
      
      return [];
    } catch (error: any) {
      throw error;
    }
  },

  // Upload a new showcase
  async uploadShowcase(
    professionalId: number, 
    data: ShowcaseFormData
  ): Promise<ShowcaseItem> {
    try {
      const endpoint = `/professional-showcase/${professionalId}/upload`;
      
      const formData = new FormData();
      
      if (data.file) {
        formData.append('file', data.file);
      }
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      const response = await api.post<ShowcaseItem>(endpoint, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing showcase
  async updateShowcase(
    professionalId: number,
    showcaseId: number,
    data: ShowcasePatchData
  ): Promise<ShowcaseItem> {
    try {
      const endpoint = `/professional-showcase/${professionalId}/${showcaseId}`;
      
      const formData = new FormData();
      
      if (data.file) {
        formData.append('file', data.file);
      }
      
      if (data.description !== undefined) {
        formData.append('description', data.description);
      }
      
      if (data.status !== undefined) {
        formData.append('status', data.status);
      }
      
      if (data.reason !== undefined) {
        formData.append('reason', data.reason || '');
      }
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active.toString());
      }
      
      const response = await api.patch<ShowcaseItem>(endpoint, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a showcase
  async deleteShowcase(
    professionalId: number,
    showcaseId: number
  ): Promise<void> {
    try {
      const endpoint = `/professional-showcase/${professionalId}/${showcaseId}`;
      await api.delete(endpoint);
    } catch (error) {
      throw error;
    }
  },

  // Toggle showcase active status
  async toggleShowcaseActive(
    professionalId: number,
    showcaseId: number,
    isActive: boolean
  ): Promise<ShowcaseItem> {
    try {
      const endpoint = `/professional-showcase/${professionalId}/${showcaseId}`;
      
      const formData = new FormData();
      formData.append('is_active', isActive.toString());
      
      const response = await api.patch<ShowcaseItem>(endpoint, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};