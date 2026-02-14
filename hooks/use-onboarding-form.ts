'use client';

import { useState, useCallback } from 'react';

export interface OnboardingFormData {
  address: any; // AddressSection handles its own state
  emergency: {
    ec_name: string;
    ec_relationship: string;
    ec_phone: string;
    referred_by: string;
    referrer_name?: string;
  };
  skillsPayment: {
    skills: string[];
    payment_method: 'cash' | 'esewa' | 'khalti' | 'imepay' | 'bank_transfer';
    phone_number?: string;
    bank_account_number?: string;
    bank_branch_name?: string;
    bank_name?: string;
    bank_account_holder_name?: string;
  };
}

const initialFormData: OnboardingFormData = {
  address: {},
  emergency: {
    ec_name: '',
    ec_relationship: '',
    ec_phone: '',
    referred_by: '',
    referrer_name: '',
  },
  skillsPayment: {
    skills: [],
    payment_method: 'cash',
  },
};

export function useOnboardingForm() {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);

  const updateFormData = useCallback((
    step: keyof OnboardingFormData,
    data: Partial<OnboardingFormData[keyof OnboardingFormData]>
  ) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
      },
    }));
  }, []);

  const getStepData = useCallback((step: number) => {
    switch (step) {
      case 0: return formData.address;
      case 1: return formData.emergency;
      case 2: return formData.skillsPayment;
      default: return null;
    }
  }, [formData]);

  const validateStep = useCallback((step: number, data: any): boolean => {
    switch (step) {
      case 0: {
        // Address validation - handled by AddressSection
        // We'll assume it's valid if we're here
        return true;
      }
      case 1: {
        // Emergency contact validation
        if (!data.ec_name || !data.ec_relationship || !data.ec_phone || !data.referred_by) {
          return false;
        }
        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(data.ec_phone.replace(/\D/g, ''))) {
          return false;
        }
        // If referred_by is 'Friend', require referrer_name
        if (data.referred_by === 'Friend' && !data.referrer_name) {
          return false;
        }
        return true;
      }
      case 2: {
        // Skills validation
        if (!data.skills || data.skills.length === 0) return false;
        
        // Payment method validation
        if (!data.payment_method) return false;
        
        // Digital payment phone validation
        if (['esewa', 'khalti', 'imepay'].includes(data.payment_method)) {
          if (!data.phone_number) return false;
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(data.phone_number.replace(/\D/g, ''))) return false;
        }
        
        // Bank transfer validation happens in bank details drawer
        return true;
      }
      default: return true;
    }
  }, []);

  const isStepValid = useCallback((step: number): boolean => {
    const data = getStepData(step);
    return validateStep(step, data);
  }, [getStepData, validateStep]);

  return {
    formData,
    updateFormData,
    getStepData,
    validateStep,
    isStepValid,
  };
}