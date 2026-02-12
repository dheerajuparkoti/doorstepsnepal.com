
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ProfessionalWallet, ProfessionalWalletStats } from '@/lib/data/professional/wallet';
import { Withdrawal, WithdrawalFilters, WithdrawalStats } from '@/lib/data/professional/withdrawal';
import { OrderCommission } from '@/lib/data/professional/commission';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { WITHDRAWAL_CONSTANTS } from '@/lib/data/professional/constants';

interface WalletState {
  // Data
  wallet: ProfessionalWallet | null;
  withdrawals: Withdrawal[];
  commissions: OrderCommission[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Filters
  withdrawalFilters: WithdrawalFilters;
  
  // Actions
  setWallet: (wallet: ProfessionalWallet) => void;
  setWithdrawals: (withdrawals: Withdrawal[]) => void;
  setCommissions: (commissions: OrderCommission[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter Actions
  setWithdrawalFilter: (filters: Partial<WithdrawalFilters>) => void;
  clearWithdrawalFilters: () => void;
  
  // Computed
  getFilteredWithdrawals: () => Withdrawal[];
  getWithdrawalStats: () => WithdrawalStats;
  getWalletStats: () => ProfessionalWalletStats | null;
}

export const useWalletStore = create<WalletState>()(
  devtools(
    (set, get) => ({
      // Initial State
      wallet: null,
      withdrawals: [],
      commissions: [],
      isLoading: false,
      error: null,
      withdrawalFilters: {},

      // Setters
      setWallet: (wallet) => set({ wallet }),
      setWithdrawals: (withdrawals) => set({ withdrawals }),
      setCommissions: (commissions) => set({ commissions }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Filter Actions
      setWithdrawalFilter: (filters) => 
        set((state) => ({
          withdrawalFilters: { ...state.withdrawalFilters, ...filters }
        })),
      
      clearWithdrawalFilters: () => 
        set({ withdrawalFilters: {} }),

      // Computed: Filtered withdrawals
      getFilteredWithdrawals: () => {
        const { withdrawals, withdrawalFilters } = get();
        let filtered = [...withdrawals];

        // Quick filter by date
        if (withdrawalFilters.quickFilter && withdrawalFilters.quickFilter !== 'all') {
          const startDate = NepaliDateService.getDateFromFilter(withdrawalFilters.quickFilter);
          if (startDate) {
            filtered = filtered.filter(w => {
              const wDate = NepaliDateService.toBS(w.request_date_np);
              return NepaliDateService.isAfter(wDate, startDate);
            });
          }
        }

        // Status filter
        if (withdrawalFilters.status) {
          filtered = filtered.filter(w => w.status === withdrawalFilters.status);
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => {
          const dateA = NepaliDateService.toBS(a.request_date_np);
          const dateB = NepaliDateService.toBS(b.request_date_np);
          return NepaliDateService.compare(dateA, dateB);
        });

        return filtered;
      },

      // Computed: Withdrawal statistics
      getWithdrawalStats: () => {
        const withdrawals = get().getFilteredWithdrawals();
        
        return {
          totalRequests: withdrawals.length,
          totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
          completed: withdrawals.filter(w => w.status === 'completed').length,
          pending: withdrawals.filter(w => w.status === 'pending').length,
          approved: withdrawals.filter(w => w.status === 'approved').length,
          rejected: withdrawals.filter(w => w.status === 'rejected').length
        };
      },

      // Computed: Wallet with eligibility stats
      getWalletStats: () => {
        const wallet = get().wallet;
        if (!wallet) return null;

        const minimumRequired = WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL;
        const isEligible = wallet.current_balance >= minimumRequired;
        const remainingAmount = Math.max(0, minimumRequired - wallet.current_balance);
        const eligibilityPercent = Math.min(100, (wallet.current_balance / minimumRequired) * 100);

        return {
          ...wallet,
          netEarnings: wallet.total_earned - wallet.total_commission,
          withdrawalEligibility: {
            isEligible,
            minimumRequired,
            remainingAmount,
            eligibilityPercent
          }
        };
      }
    }),
    { name: 'wallet-store' }
  )
);