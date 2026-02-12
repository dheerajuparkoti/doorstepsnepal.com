
export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export interface Withdrawal {
  id: number;
  professional_id: number;
  amount: number;
  payout_method: string;
  reference_id: string;
  status: WithdrawalStatus;
  request_date_np: string;
  notes?: string;
}

export interface WithdrawalCreateRequest {
  professional_id: number;
  amount: number;
  notes?: string;
}

export interface WithdrawalFilters {
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  status?: WithdrawalStatus;
  quickFilter?: string;
}

export interface WithdrawalStats {
  totalRequests: number;
  totalAmount: number;
  completed: number;
  pending: number;
  approved: number;
  rejected: number;
}