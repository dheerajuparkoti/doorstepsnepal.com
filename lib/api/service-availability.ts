import { api } from '@/config/api-client';
import {
  ServiceAvailability,
  ServiceAvailabilityCreateData,
  ServiceAvailabilityUpdateData,
  ServiceAvailabilityListResponse,
} from '@/lib/data/service-availability';

export const serviceAvailabilityApi = {
  // Get professional's service availabilities
  async getServiceAvailabilities(
    professionalId: number,
    params?: {
      skip?: number;
      limit?: number;
    }
  ): Promise<ServiceAvailabilityListResponse> {
    try {
      const endpoint = `/service_availability`;
      const response = await api.get<ServiceAvailabilityListResponse>(endpoint, {
        params: { professional_id: professionalId, ...params }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new service availability
  async createServiceAvailability(
    data: ServiceAvailabilityCreateData
  ): Promise<ServiceAvailability> {
    try {
      const endpoint = `/service_availability`;
      const response = await api.post<ServiceAvailability>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update service availability
  async updateServiceAvailability(
    availabilityId: number,
    data: ServiceAvailabilityUpdateData
  ): Promise<ServiceAvailability> {
    try {
      const endpoint = `/service_availability/${availabilityId}`;
      const response = await api.put<ServiceAvailability>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete service availability
  async deleteServiceAvailability(availabilityId: number): Promise<void> {
    try {
      const endpoint = `/service_availability/${availabilityId}`;
      await api.delete<void>(endpoint);
    } catch (error) {
      throw error;
    }
  },
};