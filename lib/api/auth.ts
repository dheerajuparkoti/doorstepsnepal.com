
import { api, setToken, removeToken, getToken } from '@/config/api-client';
import { 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyOTPResponse, 
  SetupProfileRequest,
  User 
} from '@/lib/data/auth';
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
    
    return { ...response, remember: rememberMe };
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
  }
): Promise<User> {
  try {
    const results = await Promise.allSettled([
      api.patch<User>('/users/fullname', { full_name: profileData.full_name }),
      api.patch<User>('/users/gender', { gender: profileData.gender }),
      api.patch<User>('/users/age-group', { age_group: profileData.age_group }),
      api.patch<User>('/users/email', { email: profileData.email })
    ]);
    
    
    // Check if any requests failed
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.error('Some profile updates failed:', failed);
      throw new Error('Profile setup partially failed');
    }
    
    // Get the last successful response 
    const response = results[results.length - 1] as PromiseFulfilledResult<User>;
    
    // Update store
    if (useUserStore) {
      useUserStore.getState().updateUser(response.value);
    }
    
    console.log("USERS DATA", response.value);
    return response.value;
  } catch (error) {
    console.error('Setup profile error:', error);
    throw error;
  }
}


// Get user profile (requires valid token)
export async function getUserProfile(): Promise<User> {
  return api.get<User>('/users/me');
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

