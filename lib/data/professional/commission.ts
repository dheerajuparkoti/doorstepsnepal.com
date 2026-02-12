
export interface CommissionSlab {
  id: number;
  minPrice: number;
  maxPrice: number;
  maxCommission: number;
}

export interface OrderCommission {
  id: number;
  order_id: number;
  professional_id: number;
  pro_service_id: number;
  order_total: number;
  commission_amt: number;
  rate_applied: number;
  completed_date_np: string; 
}

export interface OrderCommissionWithDetails extends OrderCommission {
  formattedDateWithTime: string;
  professionalEarnings: number;
}