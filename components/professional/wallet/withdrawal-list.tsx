
import React, { JSX } from 'react';
import { Withdrawal, WithdrawalStatus, WithdrawalStats } from '@/lib/data/professional/withdrawal';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { StatusBadge } from '@/components/ui/professional-payment/status-badge';
import { MasonryGrid } from '@/components/ui/professional-payment/masonry-grid';

interface WithdrawalListProps {
  withdrawals: Withdrawal[];
  stats: WithdrawalStats;
  onViewAll: () => void;
  onDownloadReceipt: (withdrawal: Withdrawal) => Promise<void>;
}

const statusConfig: Record<WithdrawalStatus, { color: string; icon: JSX.Element }> = {
  pending: {
    color: 'amber',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  approved: {
    color: 'blue',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  rejected: {
    color: 'red',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  completed: {
    color: 'green',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
};

export function WithdrawalList({ withdrawals, stats, onViewAll, onDownloadReceipt }: WithdrawalListProps) {
  if (withdrawals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Withdrawals Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your withdrawal history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Withdrawals
          </h2>
        </div>
        
        {withdrawals.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All ({stats.totalRequests})
          </button>
        )}
      </div>

      {/* Withdrawals Grid */}
      <MasonryGrid
        items={withdrawals}
        columnCount={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
        gap={12}
        renderItem={(withdrawal) => {
          const status = statusConfig[withdrawal.status];
          
          return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                {/* Header with Amount and Status */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {CurrencyFormatter.format(withdrawal.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      ID: {withdrawal.reference_id}
                    </p>
                  </div>
                  <StatusBadge
                    status={withdrawal.status}
                    variant="outline"
                    size="sm"
                    icon={status.icon}
                  />
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      {NepaliDateService.formatHeader(withdrawal.request_date_np)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      {withdrawal.payout_method}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => onDownloadReceipt(withdrawal)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}