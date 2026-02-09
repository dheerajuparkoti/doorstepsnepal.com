import { apiFetch } from '@/config/api-client';
import { 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyOTPResponse, 
  SetupProfileRequest,
  User 
} from '@/lib/data/auth';

export async function login(phoneNumber: string): Promise<boolean> {
  try {
    const response = await apiFetch<{ message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.message?.includes('OTP') || false;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function verifyOTP(
  phoneNumber: string, 
  otp: string
): Promise<VerifyOTPResponse> {
  try {
    const response = await apiFetch<VerifyOTPResponse>('/auth/verify_otp', {
      method: 'POST',
      body: JSON.stringify({ 
        phone_number: phoneNumber, 
        otp 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

export async function setupProfile(
  token: string,
  data: SetupProfileRequest
): Promise<User> {
  try {
    const response = await apiFetch<User>('/users/profile/setup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Setup profile error:', error);
    throw error;
  }
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await apiFetch<User>('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

export async function checkProtectedRoute(token: string): Promise<boolean> {
  try {
    await apiFetch('/auth/protected', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

