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
    data: ServiceAvailabilityCreateData,
    bypassPending = false
  ): Promise<ServiceAvailability> {
    try {
      const payload = { ...data, bypass_pending: bypassPending };
      const endpoint = `/service_availability/`;
      const response = await api.post<ServiceAvailability>(endpoint, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update service availability
  async updateServiceAvailability(
    availabilityId: number,
    data: ServiceAvailabilityUpdateData,
    bypassPending = false
  ): Promise<ServiceAvailability> {
    try {
      const payload = { ...data, bypass_pending: bypassPending };
      const endpoint = `/service_availability/${availabilityId}`;
      const response = await api.put<ServiceAvailability>(endpoint, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete service availability
  async deleteServiceAvailability(availabilityId: number, bypassPending = false): Promise<void> {
    try {
      const endpoint = `/service_availability/${availabilityId}`;
      const params = bypassPending ? { bypass_pending: bypassPending } : undefined;
      await api.delete<void>(endpoint, params ? { params } : {});
    } catch (error) {
      throw error;
    }
  },
};