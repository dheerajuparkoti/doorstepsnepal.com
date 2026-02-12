// app/dashboard/professional/withdrawals/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/hooks/use-wallet';
import { useUserStore } from '@/stores/user-store';
import { WithdrawalFilters } from '@/components/professional/withdrawals/withdrawal-filters';
import { WithdrawalStatsCard } from '@/components/professional/withdrawals/withdrawal-stats-card';
import { WithdrawalCard } from '@/components/professional/withdrawals/withdrawal-card';
import { LoadingShimmer } from '@/components/ui/professional-payment/loading-shimmer';
import { MasonryGrid } from '@/components/ui/professional-payment/masonry-grid';
import { NetworkBanner } from '@/components/ui/professional-payment/network-banner';
import { QUICK_FILTERS } from '@/lib/data/professional/constants';

export default function WithdrawalsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  
  // Get professionalId from user store or from URL query params
  const [professionalId, setProfessionalId] = useState<number>(0);
  
  useEffect(() => {
    // Get professionalId from user store
    if (user?.professional_id) {
      setProfessionalId(user.professional_id);
    }
  }, [user]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const {
    withdrawals,
    withdrawalStats,
    isLoading,
    error,
    setWithdrawalFilter,
    clearWithdrawalFilters,
    fetchWalletData,
    downloadWithdrawalReceipt
  } = useWallet(professionalId);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'all') {
      setWithdrawalFilter({ quickFilter: undefined });
    } else {
      setWithdrawalFilter({ quickFilter: filter });
    }
  };

  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(status);
    setWithdrawalFilter({ status: status as any || undefined });
  };

  const handleClearFilters = () => {
    setSelectedFilter('all');
    setSelectedStatus(null);
    clearWithdrawalFilters();
  };

  const handleRefresh = async () => {
    await fetchWalletData();
  };

  // Fetch data when professionalId is available
  useEffect(() => {
    if (professionalId > 0) {
      fetchWalletData();
    }
  }, [professionalId, fetchWalletData]);

  if (isLoading && withdrawals.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <NetworkBanner />
        <div className="space-y-6">
          <LoadingShimmer type="card" />
          <LoadingShimmer type="grid" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <NetworkBanner />
      
      {/* Header with Wallet Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Withdrawal History
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your withdrawal requests
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Wallet Link Button */}
          <Link
            href="/dashboard/professional/wallet"
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
            <span>My Wallet</span>
          </Link>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <WithdrawalFilters
        quickFilters={QUICK_FILTERS.map(f => f.label)}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusFilter}
        onClearFilters={handleClearFilters}
        showClearButton={selectedFilter !== 'all' || selectedStatus !== null}
      />

      {/* Statistics Card */}
      {withdrawals.length > 0 && (
        <div className="mt-4">
          <WithdrawalStatsCard
            stats={withdrawalStats}
            onDownloadPDF={async () => {
              // Implement PDF download
              console.log('Download PDF');
              // You can implement your PDF generation here
            }}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* No Professional ID Warning */}
      {!professionalId && !isLoading && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Please log in as a professional to view withdrawals.
            </p>
          </div>
        </div>
      )}

      {/* Withdrawals Grid */}
      {withdrawals.length === 0 ? (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No withdrawals found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedFilter !== 'all' || selectedStatus
              ? 'Try clearing your filters'
              : 'Your withdrawal history will appear here'}
          </p>
          {(selectedFilter !== 'all' || selectedStatus) && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {/* <MasonryGrid
            items={withdrawals}
            columnCount={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            gap={16}
            renderItem={(withdrawal) => (
              <WithdrawalCard
                withdrawal={withdrawal}
                onDownloadReceipt={downloadWithdrawalReceipt}
              />
            )}
          /> */}
          <MasonryGrid
  items={withdrawals}
  columnCount={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
  gap={16}
  keyExtractor={(withdrawal) => `withdrawal-${withdrawal.id}`} 
  renderItem={(withdrawal) => (
    <WithdrawalCard
      withdrawal={withdrawal}
      onDownloadReceipt={downloadWithdrawalReceipt}
    />
  )}
/>
        </div>
      )}
    </div>
  );
}