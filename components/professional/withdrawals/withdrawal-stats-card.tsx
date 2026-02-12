
import React from 'react';
import { WithdrawalStats } from '@/lib/data/professional/withdrawal';
import { CurrencyFormatter } from '@/lib/utils/formatters';

interface WithdrawalStatsCardProps {
  stats: WithdrawalStats;
  onDownloadPDF: () => void;
}

export function WithdrawalStatsCard({ stats, onDownloadPDF }: WithdrawalStatsCardProps) {
  const statItems = [
    { label: 'Total Requests', value: stats.totalRequests, icon: 'receipt', color: 'blue' },
    { label: 'Completed', value: stats.completed, icon: 'check', color: 'green' },
    { label: 'Pending', value: stats.pending, icon: 'clock', color: 'amber' },
    { label: 'Rejected', value: stats.rejected, icon: 'x', color: 'red' }
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'receipt':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  };

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 dark:from-primary-700 dark:via-primary-600 dark:to-primary-500 rounded-xl p-6 text-white">
      {/* Total Withdrawn Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-white/80 mb-1">Total Withdrawn</p>
          <p className="text-2xl md:text-3xl font-bold">
            {CurrencyFormatter.format(stats.totalAmount)}
          </p>
        </div>
        <button
          onClick={onDownloadPDF}
          className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium">Download PDF</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-black/20 backdrop-blur-sm rounded-lg p-3"
          >
            <div className="flex items-center space-x-2 mb-1">
              <div className={colorClasses[item.color as keyof typeof colorClasses].split(' ')[0] + ' p-1 rounded-full'}>
                {getIcon(item.icon)}
              </div>
              <span className="text-xs text-white/80">{item.label}</span>
            </div>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}