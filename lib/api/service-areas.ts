import { api } from '@/config/api-client';

export interface ServiceArea {
  id: number;
  name: string;
}

export interface ServiceAreaListResponse {
  service_areas: ServiceArea[];
  total: number;
}

export interface ServiceAreaCreateRequest {
  name: string;
}

export const serviceAreasApi = {
  // Get all service areas
  async getServiceAreas(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<ServiceAreaListResponse> {
    try {
      const endpoint = `/service_areas`;
      const response = await api.get<ServiceAreaListResponse>(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new service area
  async createServiceArea(data: ServiceAreaCreateRequest): Promise<ServiceArea> {
    try {
      const endpoint = `/service_areas`;
      const response = await api.post<ServiceArea>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get professional's service areas
  async getProfessionalServiceAreas(professionalId: number): Promise<ServiceArea[]> {
    try {
      const endpoint = `/professionals/${professionalId}/service_areas`;
      const response = await api.get<ServiceArea[]>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add service areas to professional
  async addProfessionalServiceAreas(
    professionalId: number,
    serviceAreaIds: number[]
  ): Promise<string> {
    try {
      const endpoint = `/professionals/${professionalId}/service_areas`;
      const response = await api.post<string>(endpoint, serviceAreaIds);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove service area from professional
  async removeProfessionalServiceArea(
    professionalId: number,
    serviceAreaId: number
  ): Promise<string> {
    try {
      const endpoint = `/professionals/${professionalId}/service_areas/${serviceAreaId}`;
      const response = await api.delete<string>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get service area by ID
  async getServiceArea(serviceAreaId: number): Promise<ServiceArea> {
    try {
      const endpoint = `/service_areas/${serviceAreaId}`;
      const response = await api.get<ServiceArea>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update service area
  async updateServiceArea(
    serviceAreaId: number,
    data: ServiceAreaCreateRequest
  ): Promise<ServiceArea> {
    try {
      const endpoint = `/service_areas/${serviceAreaId}`;
      const response = await api.put<ServiceArea>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};