

export enum ShowcaseStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface ShowcaseItem {
  id: number;
  professional_id: number;
  image_url: string;
  description?: string;
  status: ShowcaseStatus;
  reason?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShowcaseFormData {
  file: File | null;
  description?: string;
}

export interface ShowcasePatchData {
  file?: File | null;
  description?: string;
  status?: ShowcaseStatus;
  reason?: string | null;
  is_active?: boolean;
}