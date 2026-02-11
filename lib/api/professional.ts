// lib/api/professional.ts - ADD REGISTER METHOD
import { api } from '@/config/api-client';
import { 
  ProfessionalProfile, 
  ProfessionalUpdateData, 
  ProfessionalRegistrationData 
} from '@/lib/data/professional';



export interface ServiceArea {
  id: number;
  name: string;
}

export interface ServiceAreaCreateRequest {
  name: string;
}

export const professionalApi = {
  // Register a new professional
  async registerProfessional(data: ProfessionalRegistrationData): Promise<ProfessionalProfile> {
    try {
      const endpoint = `/professionals/register`;
      const response = await api.post<ProfessionalProfile>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get professional profile by ID
  async getProfessional(professionalId: number): Promise<ProfessionalProfile> {
    try {
      const endpoint = `/professionals/${professionalId}`;
      const response = await api.get<ProfessionalProfile>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get professional by phone number
  async getProfessionalByPhone(phoneNumber: string): Promise<ProfessionalProfile> {
    try {
      const endpoint = `/professionals/phone/${phoneNumber}`;
      const response = await api.get<ProfessionalProfile>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update professional profile (PUT - full update)
  async updateProfessional(
    professionalId: number, 
    data: ProfessionalUpdateData
  ): Promise<ProfessionalProfile> {
    try {
      const endpoint = `/professionals/${professionalId}`;
      const response = await api.put<ProfessionalProfile>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Patch professional profile (PATCH - partial update)
  async patchProfessional(
    professionalId: number, 
    data: Partial<ProfessionalUpdateData>
  ): Promise<ProfessionalProfile> {
    try {
      const endpoint = `/professionals/${professionalId}`;
      const response = await api.patch<ProfessionalProfile>(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },


  // Service Areas APIs
  
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

  // Service area management
  
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

  // Get all service areas (for search/select)
  async getAllServiceAreas(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<{ service_areas: ServiceArea[]; total: number }> {
    try {
      const endpoint = `/service_areas`;
      const response = await api.get<{ service_areas: ServiceArea[]; total: number }>(endpoint, { params });
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
