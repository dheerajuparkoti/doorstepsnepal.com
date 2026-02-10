
import { api, setToken, removeToken, getToken } from '@/config/api-client';
import { 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyOTPResponse, 
  SetupProfileRequest,
  User 
} from '@/lib/data/auth';

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
  data: SetupProfileRequest
): Promise<User> {
  try {
    const response = await api.post<User>('/users/profile/setup', data);
    console.log("USERS DATA", response);
    return response;
  } catch (error) {
    console.error('Setup profile error:', error);
    throw error;
  }
}

export async function checkProtectedRoute(): Promise<boolean> {
  try {
    await api.get('/auth/protected');
    return true;
  } catch (error) {
    return false;
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

