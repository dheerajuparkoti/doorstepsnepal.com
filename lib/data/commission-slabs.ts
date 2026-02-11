export interface CommissionSlab {
  id: number;
  min_price: number;
  max_price: number;
  max_commission: number;
}

export interface CommissionSlabsResponse {
  commission_slabs?: CommissionSlab[];
}