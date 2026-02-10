
import { User } from '@/lib/data/user';
import { api, removeToken } from '@/config/api-client';
import { useUserStore } from '@/stores/user-store';

export async function getUserProfile(): Promise<User> {
  console.log("Fetching user profile...");
  
  try {
    const response = await api.get<any>('/users/me', { 
      cache: 'no-store' 
    });
    

    const userData: User = {
      id: response.id,
      phone_number: response.phone_number,
      phone: response.phone_number,
      full_name: response.full_name || "",
      name: response.full_name || "",
      nameNe: response.full_name || "",
      email: response.email || "",
      gender: response.gender || "",
      age_group: response.age_group || "",
      ageGroup: response.age_group || "",
      profile_image: response.profile_image || "",
      avatar: response.profile_image || "",
      type: response.type || "customer",
      mode: response.type || "customer",
      is_setup_complete: response.is_setup_complete || false,
      isVerified: true,
      isProfessionalVerified: response.type === "professional",

      // Optional fields
      order_count: response.order_count,
      total_spent: response.total_spent,
      full_address: response.full_address,
      member_since: response.member_since,
      deletion_requested: response.deletion_requested,
      deletion_requested_at: response.deletion_requested_at,
      is_deleted: response.is_deleted,
      is_admin_approved: response.is_admin_approved,
      professional_id: response.professional_id,
    };
    

    // Update Zustand store
    const { setUser } = useUserStore.getState();
    setUser(userData);
    
    return userData;
    // Update Zustand store if needed
    // if (useUserStore) {
    //   useUserStore.getState().updateUser(userData);
    // }
    
    // return userData;
  } catch (error) {
    console.error('Get user profile error:', error);
    
    // If it's a 401 error, clear auth state
    if (error instanceof Error && error.message.includes('401')) {
      console.log("401 error detected, clearing auth state");
      removeToken();
      
      if (useUserStore) {
        useUserStore.getState().clearUser();
      }
    }
    
    throw error;
  }
}

// Update full name
export async function updateFullName(full_name: string): Promise<User> {
  const response = await api.patch<User>('/users/fullname', { full_name });
  
  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Update gender
export async function updateGender(gender: string): Promise<User> {
  const response = await api.patch<User>('/users/gender', { gender });
  
  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Update age group
export async function updateAgeGroup(age_group: string): Promise<User> {
  const response = await api.patch<User>('/users/age-group', { age_group });
  
  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Update email
export async function updateEmail(email: string): Promise<User> {
  const response = await api.patch<User>('/users/email', { email });
  
  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Update phone
export async function updatePhone(phone_number: string): Promise<User> {
  const response = await api.patch<User>('/users/phone', { phone_number });
  
  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Update profile image
export async function updateProfileImage(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.patch<User>('/users/profile-image', formData);

  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Cancel account deletion
export async function cancelAccountDeletion(): Promise<User> {
  const response = await api.post<User>('/users/cancel-deletion');
  
  if (useUserStore) {
    useUserStore.getState().updateUser(response);
  }
  
  return response;
}

// Delete account
export async function deleteAccount(): Promise<{ message: string }> {
  return api.delete<{ message: string }>('/users/me');
}