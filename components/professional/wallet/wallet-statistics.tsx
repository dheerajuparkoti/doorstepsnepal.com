
import React from 'react';
import { ProfessionalWalletStats } from '@/lib/data/professional/wallet';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { MasonryGrid } from '@/components/ui/professional-payment/masonry-grid';

interface WalletStatisticsProps {
  wallet: ProfessionalWalletStats;
}

export function WalletStatistics({ wallet }: WalletStatisticsProps) {
  const {
    total_earned,
    total_commission,
    total_withdrawn,
    netEarnings
  } = wallet;

  const stats = [
    {
      title: 'Total Earned',
      amount: total_earned,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'amber',
      subtitle: 'Lifetime earnings'
    },
    {
      title: 'Commission Paid',
      amount: total_commission,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4-9 4-9-4z" />
        </svg>
      ),
      color: 'red',
      subtitle: 'Platform fees'
    },
    {
      title: 'Total Withdrawn',
      amount: total_withdrawn,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      color: 'green',
      subtitle: 'Amount withdrawn'
    },
    {
      title: 'Net Earnings',
      amount: netEarnings,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue',
      subtitle: 'After Platform fees'
    }
  ];

  const calculatePercentage = (amount: number) => {
    if (total_earned <= 0) return '0.0%';
    return `${((amount / total_earned) * 100).toFixed(1)}%`;
  };

  const colorClasses = {
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
        Earnings Overview
      </h2>
      
      <MasonryGrid
        items={stats}
        columnCount={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
        gap={12}
        renderItem={(stat) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          
          return (
            <div className={`
              p-4 rounded-xl border ${colors.border} ${colors.bg}
              transition-all hover:shadow-md
            `}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <div className={colors.text}>
                    {stat.icon}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                  {calculatePercentage(stat.amount)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              
              <p className={`text-xl font-bold ${colors.text} mb-1`}>
                {CurrencyFormatter.format(stat.amount)}
              </p>
              
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {stat.subtitle}
              </p>
            </div>
          );
        }}
      />
    </div>
  );
}