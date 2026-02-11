// // stores/professional-store.ts - ADD REGISTER ACTION
// import { create } from 'zustand';
// import { 
//   ProfessionalProfile, 
//   ProfessionalUpdateData, 
//   ProfessionalRegistrationData 
// } from '@/lib/data/professional';
// import { professionalApi } from '@/lib/api/professional';

// interface ProfessionalStore {
//   profile: ProfessionalProfile | null;
//   isLoading: boolean;
//   error: string | null;
//   isUpdating: boolean;
//   isRegistering: boolean;
  
//   registerProfessional: (data: ProfessionalRegistrationData) => Promise<ProfessionalProfile>;
//   fetchProfile: (professionalId: number) => Promise<void>;
//   fetchProfileByPhone: (phoneNumber: string) => Promise<void>;
//   updateProfile: (professionalId: number, data: ProfessionalUpdateData) => Promise<ProfessionalProfile>;
//   patchProfile: (professionalId: number, data: Partial<ProfessionalUpdateData>) => Promise<ProfessionalProfile>;
//   clearError: () => void;
//   clearProfile: () => void;
// }

// export const useProfessionalStore = create<ProfessionalStore>((set, get) => ({
//   // Initial state
//   profile: null,
//   isLoading: false,
//   error: null,
//   isUpdating: false,
//   isRegistering: false,

//   // Register a new professional
//   registerProfessional: async (data: ProfessionalRegistrationData) => {
//     set({ isRegistering: true, error: null });
    
//     try {
//       const newProfile = await professionalApi.registerProfessional(data);
      
//       set({
//         profile: newProfile,
//         isRegistering: false,
//       });
      
//       return newProfile;
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to register professional';
//       set({ 
//         error: errorMessage, 
//         isRegistering: false 
//       });
//       throw error;
//     }
//   },

//   // Fetch professional profile by ID
//   fetchProfile: async (professionalId: number) => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const profile = await professionalApi.getProfessional(professionalId);
//       set({ 
//         profile: profile,
//         isLoading: false 
//       });
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile';
//       set({ 
//         error: errorMessage, 
//         isLoading: false,
//         profile: null 
//       });
//     }
//   },

//   // Fetch professional by phone number
//   fetchProfileByPhone: async (phoneNumber: string) => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const profile = await professionalApi.getProfessionalByPhone(phoneNumber);
//       set({ 
//         profile: profile,
//         isLoading: false 
//       });
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile by phone';
//       set({ 
//         error: errorMessage, 
//         isLoading: false,
//         profile: null 
//       });
//     }
//   },

//   // Update professional profile (full update)
//   updateProfile: async (professionalId: number, data: ProfessionalUpdateData) => {
//     set({ isUpdating: true, error: null });
//     try {
//       const updatedProfile = await professionalApi.updateProfessional(professionalId, data);
      
//       set({
//         profile: updatedProfile,
//         isUpdating: false,
//       });
      
//       return updatedProfile;
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Failed to update profile';
//       set({ 
//         error: errorMessage, 
//         isUpdating: false 
//       });
//       throw error;
//     }
//   },

//   // Patch professional profile (partial update)
//   patchProfile: async (professionalId: number, data: Partial<ProfessionalUpdateData>) => {
//     set({ isUpdating: true, error: null });
//     try {
//       const updatedProfile = await professionalApi.patchProfessional(professionalId, data);
      
//       set({
//         profile: updatedProfile,
//         isUpdating: false,
//       });
      
//       return updatedProfile;
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Failed to update profile';
//       set({ 
//         error: errorMessage, 
//         isUpdating: false 
//       });
//       throw error;
//     }
//   },

//   // Clear error
//   clearError: () => set({ error: null }),

//   // Clear profile
//   clearProfile: () => set({ profile: null }),
// }));



// stores/professional-store.ts - WITH SERVICE AREAS
import { create } from 'zustand';
import { 
  ProfessionalProfile, 
  ProfessionalUpdateData, 
  ProfessionalRegistrationData 
} from '@/lib/data/professional';
import { professionalApi } from '@/lib/api/professional';

// Add ServiceArea interface
export interface ServiceArea {
  id: number;
  name: string;
}

interface ProfessionalStore {
  profile: ProfessionalProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  isRegistering: boolean;
  
  // Service Areas state
  serviceAreas: ServiceArea[];
  isLoadingServiceAreas: boolean;
  isUpdatingServiceAreas: boolean;
  
  // Professional CRUD
  registerProfessional: (data: ProfessionalRegistrationData) => Promise<ProfessionalProfile>;
  fetchProfile: (professionalId: number) => Promise<void>;
  fetchProfileByPhone: (phoneNumber: string) => Promise<void>;
  updateProfile: (professionalId: number, data: ProfessionalUpdateData) => Promise<ProfessionalProfile>;
  patchProfile: (professionalId: number, data: Partial<ProfessionalUpdateData>) => Promise<ProfessionalProfile>;
  
  // Service Areas CRUD
  fetchServiceAreas: (professionalId: number) => Promise<void>;
  addServiceArea: (
    professionalId: number, 
    district: string, 
    municipality: string, 
    ward?: number
  ) => Promise<ServiceArea>;
  removeServiceArea: (professionalId: number, serviceAreaId: number) => Promise<void>;
  saveServiceAreas: (professionalId: number, serviceAreaIds: number[]) => Promise<void>;
  
  // Utility
  clearError: () => void;
  clearProfile: () => void;
  clearServiceAreas: () => void;
}

export const useProfessionalStore = create<ProfessionalStore>((set, get) => ({
  // Initial state
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  isRegistering: false,
  
  // Service Areas initial state
  serviceAreas: [],
  isLoadingServiceAreas: false,
  isUpdatingServiceAreas: false,

  // Register a new professional
  registerProfessional: async (data: ProfessionalRegistrationData) => {
    set({ isRegistering: true, error: null });
    
    try {
      const newProfile = await professionalApi.registerProfessional(data);
      
      set({
        profile: newProfile,
        isRegistering: false,
      });
      
      return newProfile;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register professional';
      set({ 
        error: errorMessage, 
        isRegistering: false 
      });
      throw error;
    }
  },

  // Fetch professional profile by ID
  fetchProfile: async (professionalId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const profile = await professionalApi.getProfessional(professionalId);
      set({ 
        profile: profile,
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile';
      set({ 
        error: errorMessage, 
        isLoading: false,
        profile: null 
      });
    }
  },

  // Fetch professional by phone number
  fetchProfileByPhone: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const profile = await professionalApi.getProfessionalByPhone(phoneNumber);
      set({ 
        profile: profile,
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile by phone';
      set({ 
        error: errorMessage, 
        isLoading: false,
        profile: null 
      });
    }
  },

  // Update professional profile (full update)
  updateProfile: async (professionalId: number, data: ProfessionalUpdateData) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedProfile = await professionalApi.updateProfessional(professionalId, data);
      
      set({
        profile: updatedProfile,
        isUpdating: false,
      });
      
      return updatedProfile;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      set({ 
        error: errorMessage, 
        isUpdating: false 
      });
      throw error;
    }
  },

  // Patch professional profile (partial update)
  patchProfile: async (professionalId: number, data: Partial<ProfessionalUpdateData>) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedProfile = await professionalApi.patchProfessional(professionalId, data);
      
      set({
        profile: updatedProfile,
        isUpdating: false,
      });
      
      return updatedProfile;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      set({ 
        error: errorMessage, 
        isUpdating: false 
      });
      throw error;
    }
  },

  // Fetch professional's service areas
  fetchServiceAreas: async (professionalId: number) => {
    set({ isLoadingServiceAreas: true, error: null });
    
    try {
      const areas = await professionalApi.getProfessionalServiceAreas(professionalId);
      set({ 
        serviceAreas: areas,
        isLoadingServiceAreas: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch service areas';
      set({ 
        error: errorMessage, 
        isLoadingServiceAreas: false,
        serviceAreas: [] 
      });
    }
  },

  // Add service area to professional
  addServiceArea: async (
    professionalId: number, 
    district: string, 
    municipality: string, 
    ward?: number
  ) => {
    set({ isUpdatingServiceAreas: true, error: null });
    
    try {
      // Format the service area name
      const formattedMunicipality = municipality.replace(/\s+/g, '_').replace(/[^\w]/g, '');
      const serviceAreaName = ward 
        ? `${district}-${formattedMunicipality}-${ward}`
        : `${district}-${formattedMunicipality}`;
      
      // First, create or get the service area
      let serviceArea: ServiceArea;
      
      // Check if service area already exists in the system
      // For now, we'll create a new one. In a real app, you might want to search first
      serviceArea = await professionalApi.createServiceArea({
        name: serviceAreaName,
      });
      
      // Then add it to the professional
      await professionalApi.addProfessionalServiceAreas(professionalId, [serviceArea.id]);
      
      // Update local state
      set(state => ({
        serviceAreas: [...state.serviceAreas, serviceArea],
        isUpdatingServiceAreas: false,
      }));
      
      return serviceArea;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add service area';
      set({ 
        error: errorMessage, 
        isUpdatingServiceAreas: false 
      });
      throw error;
    }
  },

  // Remove service area from professional
  removeServiceArea: async (professionalId: number, serviceAreaId: number) => {
    set({ isUpdatingServiceAreas: true, error: null });
    
    try {
      await professionalApi.removeProfessionalServiceArea(professionalId, serviceAreaId);
      
      // Update local state
      set(state => ({
        serviceAreas: state.serviceAreas.filter(area => area.id !== serviceAreaId),
        isUpdatingServiceAreas: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove service area';
      set({ 
        error: errorMessage, 
        isUpdatingServiceAreas: false 
      });
      throw error;
    }
  },

  // Save multiple service areas at once (replace all)
  saveServiceAreas: async (professionalId: number, serviceAreaIds: number[]) => {
    set({ isUpdatingServiceAreas: true, error: null });
    
    try {
      // This endpoint should replace all existing service areas
      await professionalApi.addProfessionalServiceAreas(professionalId, serviceAreaIds);
      
      // We need to fetch the updated list
      const areas = await professionalApi.getProfessionalServiceAreas(professionalId);
      
      set({
        serviceAreas: areas,
        isUpdatingServiceAreas: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save service areas';
      set({ 
        error: errorMessage, 
        isUpdatingServiceAreas: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear profile
  clearProfile: () => set({ profile: null }),

  // Clear service areas
  clearServiceAreas: () => set({ serviceAreas: [] }),
}));