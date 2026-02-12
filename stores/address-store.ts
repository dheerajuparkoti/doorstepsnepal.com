// stores/address-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '@/lib/data/address';
import { addressApi } from '@/lib/api/address';

interface AddressState {
  // State
  addresses: Address[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Permanent and temporary addresses (convenience getters)
  permanentAddress: Address | null;
  temporaryAddress: Address | null;
  
  // Actions
  fetchAddresses: (force?: boolean) => Promise<void>;
  createAddress: (data: CreateAddressRequest) => Promise<Address>;
  updateAddress: (addressId: number, data: UpdateAddressRequest) => Promise<Address>;
  deleteAddress: (addressId: number) => Promise<void>;
  clearAddresses: () => void;
  clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAddressStore = create<AddressState>((set, get) => ({
  // State
  addresses: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  lastFetched: null,
  
  // Getters
  get permanentAddress() {
    return get().addresses.find(addr => addr.type === 'permanent') || null;
  },
  
  get temporaryAddress() {
    return get().addresses.find(addr => addr.type === 'temporary') || null;
  },

  // Fetch all addresses
  fetchAddresses: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    if (!force && 
        state.addresses.length > 0 && 
        state.lastFetched && 
        now - state.lastFetched < CACHE_DURATION) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const addresses = await addressApi.getAddresses();
      set({
        addresses,
        isLoading: false,
        lastFetched: Date.now(),
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch addresses';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Create new address
  createAddress: async (data: CreateAddressRequest) => {
    set({ isUpdating: true, error: null });

    try {
      const newAddress = await addressApi.createAddress(data);
      
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        isUpdating: false,
      }));

      return newAddress;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create address';
      set({
        error: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId: number, data: UpdateAddressRequest) => {
    set({ isUpdating: true, error: null });

    try {
      const updatedAddress = await addressApi.updateAddress(addressId, data);
      
      set((state) => ({
        addresses: state.addresses.map(addr =>
          addr.id === addressId ? updatedAddress : addr
        ),
        isUpdating: false,
      }));

      return updatedAddress;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update address';
      set({
        error: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId: number) => {
    set({ isUpdating: true, error: null });

    try {
      await addressApi.deleteAddress(addressId);
      
      set((state) => ({
        addresses: state.addresses.filter(addr => addr.id !== addressId),
        isUpdating: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete address';
      set({
        error: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Clear addresses
  clearAddresses: () => {
    set({
      addresses: [],
      lastFetched: null,
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

// Selector hooks
export const useAddresses = () => useAddressStore((state) => state.addresses);
export const usePermanentAddress = () => useAddressStore((state) => state.permanentAddress);
export const useTemporaryAddress = () => useAddressStore((state) => state.temporaryAddress);
export const useAddressLoading = () => useAddressStore((state) => state.isLoading);
export const useAddressUpdating = () => useAddressStore((state) => state.isUpdating);
export const useAddressError = () => useAddressStore((state) => state.error);
export const useFetchAddresses = () => useAddressStore((state) => state.fetchAddresses);
export const useCreateAddress = () => useAddressStore((state) => state.createAddress);
export const useUpdateAddress = () => useAddressStore((state) => state.updateAddress);
export const useDeleteAddress = () => useAddressStore((state) => state.deleteAddress);