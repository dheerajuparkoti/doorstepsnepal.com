// export type UserMode = "customer" | "professional";

// export interface LoginRequest {
//   phone_number: string;
// }

// export interface VerifyOTPRequest {
//   phone_number: string;
//   otp: string;
// }

// export interface VerifyOTPResponse {
//   access_token: string;
//   token_type: string;
//   user?: User;
// }

// export interface User {
//   id: number;
//   name: string;
//   nameNe: string;
//   email: string;
//   phone: string;
//   avatar?: string;
//   gender?: string;
//   ageGroup?: string;
//   isVerified: boolean;
//   isProfessionalVerified: boolean;
//   mode: UserMode;
//   // New fields from API
//   phone_number: string;
//   full_name?: string;
//   age_group?: string;
//   user_type?: UserMode;
//   is_setup_complete?: boolean;
// }

// export interface SetupProfileRequest {
//   full_name: string;
//   email?: string;
//   gender: string;
//   age_group: string;
//   user_type: UserMode;
// }


export type UserMode = "customer" | "professional";

export interface LoginRequest {
  phone_number: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp: string;
}

export interface VerifyOTPResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: number;
    phone_number: string;
    full_name?: string;
    email?: string;
    gender?: string;
    age_group?: string;
    profile_image?: string;
    user_type?: UserMode;
    is_setup_complete: boolean;
  };
}

export interface User {
  id: number;
  phone_number: string;
  phone: string;
  full_name: string;
  name: string;
  nameNe: string;
  email?: string;
  gender?: string;
  age_group?: string;
  ageGroup?: string;
  profile_image?: string;
  avatar?: string;
  user_type: UserMode;
  mode: UserMode;
  is_setup_complete: boolean;
  isVerified: boolean;
  isProfessionalVerified: boolean;
}

export interface SetupProfileRequest {
  full_name: string;
  email?: string;
  gender: string;
  age_group: string;
  user_type: UserMode;
}