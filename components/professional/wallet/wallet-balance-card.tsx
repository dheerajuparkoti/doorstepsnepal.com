import React from 'react';
import { ProfessionalWalletStats } from '@/lib/data/professional/wallet';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { ProgressWithLabel } from '@/components/ui/professional-payment/progress-with-labels';
import { WITHDRAWAL_CONSTANTS } from '@/lib/data/professional/constants';
import { useI18n } from '@/lib/i18n/context';

interface WalletBalanceCardProps {
  wallet: ProfessionalWalletStats | null;
  onWithdraw: () => void;
}

export function WalletBalanceCard({ wallet, onWithdraw }: WalletBalanceCardProps) {
  const { language } = useI18n();

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  if (!wallet) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-muted border border-border">
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-muted-foreground/10 rounded-xl">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {getLocalizedText('Available Balance', 'उपलब्ध ब्यालेन्स')}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {CurrencyFormatter.format(0)}
                </p>
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

  const formattedBalance = CurrencyFormatter.format(current_balance ?? 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-primary-foreground">
      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary-foreground/20 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-primary-foreground/80">
                {getLocalizedText('Available Balance', 'उपलब्ध ब्यालेन्स')}
              </p>
              <p className="text-2xl md:text-3xl font-bold">
                {formattedBalance}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary-foreground/20 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-primary-foreground/80">
              {getLocalizedText('Live', 'लाइभ')}
            </span>
          </div>
        </div>

        {/* Withdrawal Eligibility Progress */}
        <div className="mb-6 text-primary-foreground">
         
          <ProgressWithLabel
            value={current_balance ?? 0}
            max={minimumRequired}
            currentLabel={getLocalizedText('Withdrawal Eligibility', 'निकासी योग्यता')}
            maxLabel={CurrencyFormatter.format(minimumRequired)}
            showPercentage
          />
        </div>

        {/* Withdraw Button */}
        {isEligible && (
          <button
            onClick={onWithdraw}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-600 dark:text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>{getLocalizedText('Withdraw Funds', 'रकम निकासी')}</span>
          </button>
        )}
      </div>
    </div>
  );
}