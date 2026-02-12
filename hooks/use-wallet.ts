
import { useEffect, useCallback, useMemo } from 'react';
import { useWalletStore } from '@/stores/professional/wallet-store';
import { WalletApi } from '@/lib/api/professional-payment/wallet-api';
import { PDFService } from '@/lib/services/pdf-services';
import { Withdrawal } from '@/lib/data/professional/withdrawal';
export function useWallet(professional_id: number) {
  const {
    wallet,
    withdrawals,
    commissions,
    isLoading,
    error,
    setWallet,
    setWithdrawals,
    setCommissions,
    setLoading,
    setError,
    getWalletStats,
    getFilteredWithdrawals,
    getWithdrawalStats
  } = useWalletStore();

  const fetchWalletData = useCallback(async () => {
    // Don't fetch if professional_id is invalid
    if (!professional_id || professional_id <= 0) {
      setError('Invalid professional ID');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const [walletData, withdrawalsData, commissionsData] = await Promise.all([
        WalletApi.getWallet(professional_id),
        WalletApi.getWithdrawals(professional_id),
        WalletApi.getCommissionReport(professional_id)
      ]);
      
      setWallet(walletData);
      setWithdrawals(withdrawalsData);
      setCommissions(commissionsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  }, [professional_id, setWallet, setWithdrawals, setCommissions, setLoading, setError]);

  const createWithdrawalRequest = useCallback(async (amount: number, notes?: string) => {
    if (!professional_id || professional_id <= 0 || !wallet) return false;
    
    if (amount > wallet.current_balance) {
      setError('Insufficient balance');
      return false;
    }
    
    setLoading(true);
    
    try {
      const request = {
        professional_id,
        amount,
        notes
      };
      
      const newWithdrawal = await WalletApi.createWithdrawal(request);
      setWithdrawals([newWithdrawal, ...withdrawals]);
      
      // Refresh wallet to update balance
      await fetchWalletData();
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create withdrawal request');
      return false;
    } finally {
      setLoading(false);
    }
  }, [professional_id, wallet, withdrawals, fetchWalletData, setWithdrawals, setLoading, setError]);

  const downloadWithdrawalReceipt = useCallback(async (withdrawal: Withdrawal): Promise<void> => {
    try {
      await PDFService.generateWithdrawalReceipt(
        withdrawal,
        {
          name: 'Doorsteps Nepal',
          address: 'Kathmandu, Nepal',
          phone: '+977-9851407706, +977-9851407707',
          email: 'info@doorstepsnepal.com'
        },
        'Professional' // You could get this from user store
      );
    } catch (err) {
      console.error('Failed to generate receipt:', err);
      // You could show a toast here
    }
  }, []);

  const downloadCommissionReport = useCallback(async (period?: string): Promise<void> => {
    if (!commissions.length || !wallet) return;
    
    try {
      await PDFService.generateCommissionReport(
        commissions,
        'Professional', // You could get this from user store
        professional_id,
        {
          name: 'Doorsteps Nepal',
          address: 'Kathmandu, Nepal',
          phone: '+977-9851407706, +977-9851407707',
          email: 'info@doorstepsnepal.com'
        },
        period
      );
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  }, [commissions, wallet, professional_id]);

  // Auto-fetch on mount or when professional_id changes
  useEffect(() => {
    if (professional_id && professional_id > 0) {
      fetchWalletData();
    }
  }, [fetchWalletData, professional_id]);

    // Safe wallet stats with default values
  const walletStats = useMemo(() => {
    const stats = getWalletStats();
    if (!stats) {
      return {
        professional_id: 0,
        total_earned: 0,
        total_commission: 0,
        total_withdrawal: 0,
        current_balance: 0,
        netEarnings: 0,
        withdrawalEligibility: {
          isEligible: false,
          minimumRequired: 1000,
          remainingAmount: 1000,
          eligibilityPercent: 0
        }
      };
    }
    return stats;
  }, [getWalletStats]);

  
  return {
    // Data
    wallet,
    walletStats: getWalletStats(),
    withdrawals: getFilteredWithdrawals(),
    allWithdrawals: withdrawals,
    commissions,
    withdrawalStats: getWithdrawalStats(),
    
    // UI State
    isLoading,
    error,
    
    // Actions
    fetchWalletData,
    createWithdrawalRequest,
    downloadWithdrawalReceipt,
    downloadCommissionReport,
    
    // Store actions
    setWithdrawalFilter: useWalletStore.getState().setWithdrawalFilter,
    clearWithdrawalFilters: useWalletStore.getState().clearWithdrawalFilters
  };
}