import { api } from '@/config/api-client';
import { CommissionSlab } from '@/lib/data/commission-slabs';

export async function fetchCommissionSlabs(): Promise<CommissionSlab[]> {
  try {
    return await api.get<CommissionSlab[]>('/commission-slabs', {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Revalidate every hour
    });
  } catch (error) {
    console.error('Error fetching commission slabs:', error);
    // Return fallback data if API fails
    return getFallbackCommissionSlabs();
  }
}

function getFallbackCommissionSlabs(): CommissionSlab[] {
  return [
    { id: 1, min_price: 0, max_price: 1000, max_commission: 100 },
    { id: 2, min_price: 1001, max_price: 5000, max_commission: 300 },
    { id: 3, min_price: 5001, max_price: 10000, max_commission: 500 },
    { id: 4, min_price: 10001, max_price: 20000, max_commission: 800 },
    { id: 5, min_price: 20001, max_price: 50000, max_commission: 1500 },
    { id: 6, min_price: 50001, max_price: 100000, max_commission: 3000 },
  ];
}