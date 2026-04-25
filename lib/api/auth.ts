
import { api, setToken, removeToken, getToken } from '@/config/api-client';
import { 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyOTPResponse, 
  SetupProfileRequest,
  User 
} from '@/lib/data/auth';
import { useAppStateStore } from '@/stores/app-state-store';
import { useUserStore } from '@/stores/user-store';

export async function login(phoneNumber: string): Promise<boolean> {
  try {
    const response = await api.post<{ message: string }>(
      '/auth/login', 
      { phone_number: phoneNumber },
      { skipAuth: true }
    );
    
    return response.message?.includes('OTP') || false;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// export async function verifyOTP(
//   phoneNumber: string, 
//   otp: string,
//   rememberMe: boolean = true
// ): Promise<VerifyOTPResponse & { remember?: boolean }> {
//   try {
//     const response = await api.post<VerifyOTPResponse>(
//       '/auth/verify_otp', 
//       { phone_number: phoneNumber, otp },
//       { skipAuth: true }
//     );
    
//     // Store the token
//     if (response.access_token) {
//       setToken(response.access_token, rememberMe);
//     }
    
//     return { ...response, remember: rememberMe };
//   } catch (error) {
//     console.error('Verify OTP error:', error);
//     throw error;
//   }
// }


export async function verifyOTP(
  phoneNumber: string, 
  otp: string,
  rememberMe: boolean = true
): Promise<VerifyOTPResponse & { remember?: boolean }> {
  try {
    const response = await api.post<VerifyOTPResponse>(
      '/auth/verify_otp', 
      { phone_number: phoneNumber, otp },
      { skipAuth: true }
    );
    
    // Store the token
    if (response.access_token) {
      setToken(response.access_token, rememberMe);
    }
    
    // IMPORTANT: Fetch user profile immediately after getting token
    try {
      const userProfile = await getUserProfile();
      
      // Update user store with full profile
      useUserStore.getState().setUser(userProfile);
      
      // Update app state store with basic info and professional_id
      useAppStateStore.getState().login(
        userProfile.id,
        userProfile.type,
        userProfile.professional_id // Pass professional_id here
      );
      
   
      // Add user to response
      return { 
        ...response, 
        remember: rememberMe,
        user: userProfile 
      };
    } catch (profileError) {
      console.error('Failed to fetch user profile after OTP:', profileError);
      // Still return token response even if profile fetch fails
      return { ...response, remember: rememberMe };
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}



export async function setupProfile(
  profileData: {
    full_name: string;
    gender: string;
    age_group: string;
    email: string;
    phone_number?: string;
    professional_id?: number;
  }
): Promise<User> {
  try {
    const requests: Promise<User>[] = [
      api.patch<User>('/users/fullname', { full_name: profileData.full_name }),
      api.patch<User>('/users/gender', { gender: profileData.gender }),
      api.patch<User>('/users/age-group', { age_group: profileData.age_group }),
      api.patch<User>('/users/email', { email: profileData.email }),
    ];
    if (profileData.phone_number) {
      requests.push(api.patch<User>('/users/phone', { phone_number: profileData.phone_number }));
    }
    const results = await Promise.allSettled(requests);
    
    // Check if any requests failed
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.error('Some profile updates failed:', failed);
      throw new Error('Profile setup partially failed');
    }
    
    // Get the last successful response 
    const response = results[results.length - 1] as PromiseFulfilledResult<User>;
    
    // Update user store
    if (useUserStore) {
      useUserStore.getState().updateUser(response.value);
    }
    
    // Update app state store if professional_id exists
    if (response.value.professional_id) {
      useAppStateStore.getState().setProfessionalId(response.value.professional_id);
    }
    
    // Also update userType in app state if it changed
    if (response.value.type) {
      useAppStateStore.getState().setUserType(response.value.type);
    }
    

    return response.value;
  } catch (error) {
    console.error('Setup profile error:', error);
    throw error;
  }
}

// Get user profile (requires valid token)
// export async function getUserProfile(): Promise<User> {
//   return api.get<User>('/users/me');
// }

export async function getUserProfile(): Promise<User> {
  const userData = await api.get<User>('/users/me');
  
  // Also update stores when fetching profile
  if (userData) {
    // Update user store
    useUserStore.getState().setUser(userData);
    
    // Update app state store
    useAppStateStore.getState().login(
      userData.id,
      userData.type,
      userData.professional_id
    );
  }
  
  return userData;
}


export async function loginViaEmail(email: string): Promise<boolean> {
  try {
    const response = await api.post<{ message: string }>(
      '/auth/login-via-email',
      { email },
      { skipAuth: true }
    );
    return response.message?.includes('OTP') || false;
  } catch (error) {
    console.error('Login via email error:', error);
    throw error;
  }
}

export async function verifyEmailOTP(
  email: string,
  otp: string,
  rememberMe: boolean = true
): Promise<VerifyOTPResponse & { remember?: boolean }> {
  try {
    const response = await api.post<VerifyOTPResponse>(
      '/auth/verify-email-otp',
      { email, otp },
      { skipAuth: true }
    );

    if (response.access_token) {
      setToken(response.access_token, rememberMe);
    }

    try {
      const userProfile = await getUserProfile();
      useUserStore.getState().setUser(userProfile);
      useAppStateStore.getState().login(
        userProfile.id,
        userProfile.type,
        userProfile.professional_id
      );
      return { ...response, remember: rememberMe, user: userProfile };
    } catch (profileError) {
      console.error('Failed to fetch user profile after email OTP:', profileError);
      return { ...response, remember: rememberMe };
    }
  } catch (error) {
    console.error('Verify email OTP error:', error);
    throw error;
  }
}

// Logout - clear token
export function logout(): void {
  removeToken();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Get current token (for debugging)
export function getCurrentToken(): string | null {
  return getToken();
}

