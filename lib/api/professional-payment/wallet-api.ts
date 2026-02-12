import { api } from '@/config/api-client';
import { ProfessionalWallet } from '@/lib/data/professional/wallet';
import { Withdrawal, WithdrawalCreateRequest } from '@/lib/data/professional/withdrawal';
import { OrderCommission } from '@/lib/data/professional/commission';

export class WalletApi {
  private static baseUrl = '/professional-wallet';

  static async getWallet(professionalId: number): Promise<ProfessionalWallet> {
    return api.get(`${this.baseUrl}/${professionalId}`);
  }

  static async getWithdrawals(professionalId: number): Promise<Withdrawal[]> {
    return api.get(`/withdrawal/professional/${professionalId}`);
  }

  static async createWithdrawal(request: WithdrawalCreateRequest): Promise<Withdrawal> {
    return api.post('/withdrawal', request);
  }

  static async getCommissionReport(professionalId: number): Promise<OrderCommission[]> {
    return api.get(`/order-commissions/professional/${professionalId}`);
  }

  static async getCommissionSlabs(): Promise<any[]> {
    return api.get('/commission-slabs');
  }
}