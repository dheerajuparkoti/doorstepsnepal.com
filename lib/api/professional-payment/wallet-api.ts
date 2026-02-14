// import { api } from '@/config/api-client';
// import { ProfessionalWallet } from '@/lib/data/professional/wallet';
// import { Withdrawal, WithdrawalCreateRequest } from '@/lib/data/professional/withdrawal';
// import { OrderCommission } from '@/lib/data/professional/commission';

import { api } from "@/config/api-client";
import { OrderCommission } from "@/lib/data/professional/commission";
import { ProfessionalWallet } from "@/lib/data/professional/wallet";
import { Withdrawal, WithdrawalCreateRequest } from "@/lib/data/professional/withdrawal";

// export class WalletApi {
//   private static baseUrl = '/professional-wallet';

//   static async getWallet(professionalId: number): Promise<ProfessionalWallet> {
//     return api.get(`${this.baseUrl}/${professionalId}`);
//   }

//   static async getWithdrawals(professionalId: number): Promise<Withdrawal[]> {
//     return api.get(`/withdrawal/professional/${professionalId}`);
//   }

//   static async createWithdrawal(request: WithdrawalCreateRequest): Promise<Withdrawal> {
//     return api.post('/withdrawal', request);
//   }

//   static async getCommissionReport(professionalId: number): Promise<OrderCommission[]> {
//     return api.get(`/order-commissions/professional/${professionalId}`);
//   }

//   static async getCommissionSlabs(): Promise<any[]> {
//     return api.get('/commission-slabs');
//   }
// }



// helper for safe GET with 404 fallback
async function safeGet<T>(url: string, defaultValue: T): Promise<T> {
  try {
    return await api.get<T>(url);
  } catch (error: any) {
    console.warn(`Safe GET failed for ${url}:`, error.message || error);
    if (error.response?.status === 404 || error.message.includes('404')) {
      return defaultValue; // return safe default
    }
    throw error; // throw real errors
  }
}


export class WalletApi {
  private static baseUrl = '/professional-wallet';

static async getWallet(professionalId: number): Promise<ProfessionalWallet> {
  return safeGet(`${this.baseUrl}/${professionalId}`, {
    professional_id: professionalId,
    total_earned: 0,
    total_commission: 0,
    total_withdrawn: 0,
    current_balance: 0,
    json: () => ({}), 
  } as ProfessionalWallet);
}


  static async getWithdrawals(professionalId: number): Promise<Withdrawal[]> {
    return safeGet(`/withdrawal/professional/${professionalId}`, []);
  }

  static async createWithdrawal(request: WithdrawalCreateRequest): Promise<Withdrawal> {
    return api.post('/withdrawal', request);
  }

  static async getCommissionReport(professionalId: number): Promise<OrderCommission[]> {
    return safeGet(`/order-commissions/professional/${professionalId}`, []);
  }

  static async getCommissionSlabs(): Promise<any[]> {
    return safeGet('/commission-slabs', []);
  }
}
