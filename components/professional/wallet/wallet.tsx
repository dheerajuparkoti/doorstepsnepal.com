
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useUserStore } from '@/stores/user-store';
import { useWallet } from '@/hooks/use-wallet';
import { WalletBalanceCard } from './wallet-balance-card';
import { WalletStatistics } from './wallet-statistics';
import { WithdrawalList } from './withdrawal-list';
import { CommissionReports } from './commission-reports';
import { InformationSection } from './information-section';
import { LoadingShimmer } from '@/components/ui/professional-payment/loading-shimmer';
import { WithdrawalRequestSheet } from './withdrawal-request-sheet';
import { RefreshControl } from '@/components/ui/professional-payment/refresh-control';
import { NetworkBanner } from '@/components/ui/professional-payment/network-banner';

export default function ProfessionalWallet() {
  const router = useRouter(); 
  const { user } = useUserStore();
  
  const [isWithdrawalSheetOpen, setIsWithdrawalSheetOpen] = useState(false);
  const [professionalId, setProfessionalId] = useState<number>(0);
  
  // Get professionalId from user store
  useEffect(() => {
    if (user?.professional_id) {
      setProfessionalId(user.professional_id);
    }
  }, [user]);

  const {
    wallet,
    walletStats,
    withdrawals,
    commissions,
    withdrawalStats,
    isLoading,
    error,
    fetchWalletData,
    createWithdrawalRequest,
    downloadWithdrawalReceipt,
    downloadCommissionReport
  } = useWallet(professionalId);

  const handleRefresh = async () => {
    await fetchWalletData();
  };

  // Fetch data when professionalId is available
  useEffect(() => {
    if (professionalId > 0) {
      fetchWalletData();
    }
  }, [professionalId, fetchWalletData]);

  // Loading state
  if (isLoading && !wallet) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <NetworkBanner />
        <div className="space-y-6">
          <LoadingShimmer type="profile" />
          <LoadingShimmer type="grid" count={4} />
          <LoadingShimmer type="card" count={2} />
        </div>
      </div>
    );
  }

  // No professional ID error
  if (!professionalId) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <NetworkBanner />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-2xl text-center max-w-md">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Professional ID Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please log in as a professional to view your wallet.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !wallet) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <NetworkBanner />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to Load Wallet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!walletStats) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <NetworkBanner />
      
      <RefreshControl onRefresh={handleRefresh}>
        <div className="space-y-8">
          {/* Main Balance Card */}
          <WalletBalanceCard
            wallet={walletStats}
            onWithdraw={() => setIsWithdrawalSheetOpen(true)}
          />

          {/* Statistics Grid */}
          <WalletStatistics wallet={walletStats} />

          {/* Recent Withdrawals */}
          <WithdrawalList
            withdrawals={withdrawals.slice(0, 5)}
            stats={withdrawalStats}
            onViewAll={() => router.push('/dashboard/professional/withdrawals')}
            onDownloadReceipt={downloadWithdrawalReceipt}
          />

          {/* Commission Reports */}
          <CommissionReports
            commissions={commissions}
            onDownloadReport={downloadCommissionReport}
          />

          {/* Information Section */}
          <InformationSection />
        </div>
      </RefreshControl>

      {/* Withdrawal Request Bottom Sheet */}
      <WithdrawalRequestSheet
        isOpen={isWithdrawalSheetOpen}
        onClose={() => setIsWithdrawalSheetOpen(false)}
        professional_id={walletStats.professional_id}
        availableBalance={walletStats.current_balance}
        onSubmit={createWithdrawalRequest}
      />
    </div>
  );
}