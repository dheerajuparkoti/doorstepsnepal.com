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
import { NetworkBanner } from '@/components/ui/professional-payment/network-banner';
import { QUICK_FILTERS } from '@/lib/data/professional/constants';
import { useI18n } from '@/lib/i18n/context';

export default function WithdrawalsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { language } = useI18n();
  
  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

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
    <>
      <NetworkBanner />
      
      {/* Header with Wallet Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getLocalizedText('Withdrawal History', 'रकम निकासी इतिहास')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getLocalizedText(
              'Track and manage your withdrawal requests',
              'तपाईंको रकम निकासी अनुरोधहरू ट्र्याक र व्यवस्थापन गर्नुहोस्'
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Wallet Link Button */}
          <Link
            href="/dashboard/professional/wallet"
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
            <span>{getLocalizedText('My Wallet', 'मेरो वालेट')}</span>
          </Link>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            aria-label={getLocalizedText('Refresh', 'रिफ्रेस')}
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
              // //console.log('Download PDF');
              // You can implement your PDF generation here
            }}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* No Professional ID Warning */}
      {!professionalId && !isLoading && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {getLocalizedText(
                'Please log in as a professional to view withdrawals.',
                'रकम निकासी हेर्नको लागि प्रोफेशनलको रूपमा लग इन गर्नुहोस्।'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Withdrawals Grid - Simple Flex with Auto-wrapping */}
      {withdrawals.length === 0 ? (
        <div className="mt-8 bg-card text-card-foreground rounded-xl p-12 text-center border border-border">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {getLocalizedText('No withdrawals found', 'कुनै निकासी फेला परेन')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {selectedFilter !== 'all' || selectedStatus
              ? getLocalizedText('Try clearing your filters', 'आफ्नो फिल्टर हटाउने प्रयास गर्नुहोस्')
              : getLocalizedText('Your withdrawal history will appear here', 'तपाईंको निकासी इतिहास यहाँ देखा पर्नेछ')}
          </p>
          {(selectedFilter !== 'all' || selectedStatus) && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {getLocalizedText('Clear Filters', 'फिल्टर हटाउनुहोस्')}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {/* Simple Flex with Auto-wrapping */}
          <div className="flex flex-wrap gap-4">
            {withdrawals.map((withdrawal) => (
              <div key={`withdrawal-${withdrawal.id}`} className="flex-1 min-w-[320px]">
                <WithdrawalCard
                  withdrawal={withdrawal}
                  onDownloadReceipt={downloadWithdrawalReceipt}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}