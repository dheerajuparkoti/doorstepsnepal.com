export type UserMode = "customer" | "professional";

export interface User {
  // Core user info
  id: number;
  phone_number: string;
  phone: string;
  full_name: string;
  name: string;
  nameNe: string;
  email?: string;
  gender?: string;
  age_group?: string;
  
  
  // Auth/Profile info
  profile_image?: string;
  avatar?: string;
  type: UserMode;
  mode: UserMode;
  is_setup_complete: boolean;
  is_onboarding_complete : boolean;
  isVerified: boolean;
  isProfessionalVerified: boolean;
  
  // Business metrics (from /users/me API)
  order_count?: number;
  total_spent?: number;
  full_address?: string;
  member_since?: number;
  deletion_requested?: boolean;
  deletion_requested_at?: string;
  is_deleted?: boolean;
  is_admin_approved?: boolean;
  professional_id?: number;
  
  // Legacy/compatibility fields
  user_type?: UserMode; // For API response compatibility
}

// API Response Types
export interface VerifyOTPResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface SetupProfileRequest {
  full_name?: string;
  email?: string;
  gender?: string;
  age_group?: string;
  user_type?: UserMode;
}

// For backward compatibility
export type UserProfileResponse = User;

// Helper types
export interface LoginRequest {
  phone_number: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp: string;
}


// Additional user-specific types if needed
export interface UpdateFieldRequest {
  full_name?: string;
  email?: string;
  gender?: string;
  age_group?: string;
  phone_number?: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Array<{
    location: string;
    message: string;
    error_type: string;
    context?: Record<string, any>;
  }>;
  extra?: Record<string, any>;
}


// Constants
export const AGE_GROUPS = [
  { value: 'age_under_18', label: 'Under 18' },
  { value: 'age_18_24', label: '18-24' },
  { value: 'age_25_34', label: '25-34' },
  { value: 'age_35_44', label: '35-44' },
  { value: 'age_45_54', label: '45-54' },
  { value: 'age_55_64', label: '55-64' },
  { value: 'age_65_plus', label: '65+' },
] as const;

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;


