
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface VerificationDocument {
  [x: string]: any;
  id: number;
  professional_id: number;
  image: string;
  description?: string;
  status: VerificationStatus;
  reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentFormData {
  image: File | null;
  description: string;
}

export interface DocumentPatchData {
  image?: File | null;
  description?: string;
  status?: VerificationStatus;
  reason?: string | null;
}