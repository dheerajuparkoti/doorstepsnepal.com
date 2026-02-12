import React from 'react';
import { ProfessionalWalletStats } from '@/lib/data/professional/wallet';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { ProgressWithLabel } from '@/components/ui/professional-payment/progress-with-labels';
import { WITHDRAWAL_CONSTANTS } from '@/lib/data/professional/constants';

interface WalletBalanceCardProps {
  wallet: ProfessionalWalletStats | null;
  onWithdraw: () => void;
}

export function WalletBalanceCard({ wallet, onWithdraw }: WalletBalanceCardProps) {

  if (!wallet) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Available Balance</p>
                <p className="text-2xl md:text-3xl font-bold text-white">Rs. 0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { current_balance, withdrawalEligibility } = wallet;
  const { isEligible, minimumRequired } = withdrawalEligibility || {
    isEligible: false,
    minimumRequired: WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL
  };

  // Safely format balance with fallback
  const formattedBalance = CurrencyFormatter.format(current_balance ?? 0);

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 dark:from-primary-700 dark:via-primary-600 dark:to-primary-500 rounded-2xl" />
      
      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">
                Available Balance
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {formattedBalance}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white">Live</span>
          </div>
        </div>

        {/* Withdrawal Eligibility Progress */}
        <div className="mb-6">
          <ProgressWithLabel
            value={current_balance ?? 0}
            max={minimumRequired}
            currentLabel="Withdrawal Eligibility"
            maxLabel={CurrencyFormatter.format(minimumRequired)}
            showPercentage
          />
        </div>

        {/* Withdraw Button */}
        {isEligible && (
          <button
            onClick={onWithdraw}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-primary-600 font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>Withdraw Funds</span>
          </button>
        )}
      </div>
    </div>
  );
}