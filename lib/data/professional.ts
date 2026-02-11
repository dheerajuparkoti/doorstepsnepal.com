// lib/data/professional.ts - ADD REGISTRATION TYPES

export enum PaymentMethod {
  CASH = 'cash',
  ESEWA = 'esewa',
  KHALTI = 'khalti',
  IMEPAY = 'imepay',
  BANK_TRANSFER = 'bank_transfer'
}

export interface Address {
  type: 'temporary' | 'permanent';
  province: string;
  district: string;
  municipality: string;
  ward_no: string;
  street_address: string;
}

export interface ServiceArea {
  id: number;
  name: string;
}

export interface User {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  type: 'professional';
  profile_image: string;
}

export interface ProfessionalProfile {
  id: number;
  user_id: number;
  refered_by?: string;
  skill?: string;
  payment_method: PaymentMethod;
  bank_account_number?: string;
  bank_branch_name?: string;
  bank_name?: string;
  bank_account_holder_name?: string;
  phone_number?: string;
  ec_name?: string;
  ec_relationship?: string;
  ec_phone?: string;
  experience: number;
  completed_orders: number;
  user: User;
  addresses: Address[];
   service_areas?: ServiceArea[];
}

export interface ProfessionalRegistrationData {
  user_id: number;
  refered_by?: string;
  skill?: string;
  payment_method: PaymentMethod;
  bank_account_number?: string;
  bank_branch_name?: string;
  bank_name?: string;
  bank_account_holder_name?: string;
  phone_number?: string;
  ec_name?: string;
  ec_relationship?: string;
  ec_phone?: string;
  experience: number;
  addresses: Address[];
  
}

export interface ProfessionalUpdateData {
  full_name?: string;
  email?: string;
  refered_by?: string;
  skill?: string;
  payment_method?: PaymentMethod;
  bank_account_number?: string;
  bank_branch_name?: string;
  bank_name?: string;
  bank_account_holder_name?: string;
  phone_number?: string;
  ec_name?: string;
  ec_relationship?: string;
  ec_phone?: string;
  experience?: number;
}

export interface PaymentInfo {
  payment_method: PaymentMethod;
  phone_number?: string;
  bank_account_number?: string;
  bank_branch_name?: string;
  bank_name?: string;
  bank_account_holder_name?: string;
}

export interface EmergencyContact {
  ec_name: string;
  ec_relationship: string;
  ec_phone: string;
}