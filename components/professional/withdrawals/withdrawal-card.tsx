
import React, { useState } from 'react';
import { Withdrawal } from '@/lib/data/professional/withdrawal';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { StatusBadge } from '@/components/ui/professional-payment/status-badge';
import { BottomSheet } from '@/components/ui/professional-payment/bottom-sheet';

interface WithdrawalCardProps {
  withdrawal: Withdrawal;
  onDownloadReceipt: (withdrawal: Withdrawal) => Promise<void>;
}

const statusConfig = {
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

export function WithdrawalCard({ withdrawal, onDownloadReceipt }: WithdrawalCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const status = statusConfig[withdrawal.status];
      console.log('withdrawal data →', withdrawal);

  return (
    <>



      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {CurrencyFormatter.format(withdrawal.amount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
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
                {/* {withdrawal.request_date_np} */}
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
              onClick={() => setShowDetails(true)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Details</span>
            </button>
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

      {/* Details Bottom Sheet */}
      <BottomSheet
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Withdrawal Details"
      >
        <div className="p-4 space-y-6">
          {/* Transaction Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              TRANSACTION INFORMATION
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">ID</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {withdrawal.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {CurrencyFormatter.format(withdrawal.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reference</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {withdrawal.reference_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <StatusBadge
                  status={withdrawal.status}
                  variant="outline"
                  size="sm"
                  icon={status.icon}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payout Method</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {withdrawal.payout_method}
                </span>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              PROFESSIONAL INFORMATION
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Professional ID</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  PRO-{withdrawal.professional_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Request Date</span>
                <span className="text-sm text-gray-900 dark:text-white">
           
                  {NepaliDateService.formatWithTime(withdrawal.request_date_np)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Notes</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {withdrawal.notes || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              onDownloadReceipt(withdrawal);
              setShowDetails(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Receipt</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}