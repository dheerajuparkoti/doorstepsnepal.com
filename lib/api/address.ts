// lib/api/address.ts
import { api } from '@/config/api-client';
import { 
  Address, 
  CreateAddressRequest, 
  UpdateAddressRequest 
} from '@/lib/data/address';

export const addressApi = {
  // Get all addresses for current user
  async getAddresses(): Promise<Address[]> {
    try {
      return await api.get<Address[]>('/address/', {
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  // Get single address by ID
  async getAddress(addressId: number): Promise<Address> {
    try {
      return await api.get<Address>(`/address/${addressId}`);
    } catch (error) {
      console.error(`Error fetching address ${addressId}:`, error);
      throw error;
    }
  },

  // Create new address
  async createAddress(data: CreateAddressRequest): Promise<Address> {
    try {
      return await api.post<Address>('/address/', data);
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  // Update address (PATCH)
  async updateAddress(addressId: number, data: UpdateAddressRequest): Promise<Address> {
    try {
      return await api.patch<Address>(`/address/${addressId}`, data);
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error;
    }
  },

  // Delete address
  async deleteAddress(addressId: number): Promise<void> {
    try {
      await api.delete(`/address/${addressId}`);
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error;
    }
  },
};