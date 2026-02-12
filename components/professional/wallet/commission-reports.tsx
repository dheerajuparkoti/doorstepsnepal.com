
import React from 'react';
import { OrderCommission } from '@/lib/data/professional/commission';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { MasonryGrid } from '@/components/ui/professional-payment/masonry-grid';

interface CommissionReportsProps {
  commissions: OrderCommission[];
  onDownloadReport: (period?: string) => Promise<void>;
}

export function CommissionReports({ commissions, onDownloadReport }: CommissionReportsProps) {
  if (commissions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Commission Reports
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete orders to see your earnings
        </p>
      </div>
    );
  }

  // Calculate summary
  const totalOrderAmount = commissions.reduce((sum, c) => sum + c.order_total, 0);
  const totalCommission = commissions.reduce((sum, c) => sum + c.commission_amt, 0);
  const netEarnings = totalOrderAmount - totalCommission;
  const avgCommissionRate = totalOrderAmount > 0 
    ? ((totalCommission / totalOrderAmount) * 100).toFixed(1) 
    : '0.0';

  const summaryStats = [
    {
      label: 'Total Orders',
      value: commissions.length.toString(),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'amber'
    },
    {
      label: 'Net Earnings',
      value: CurrencyFormatter.format(netEarnings),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      label: 'Platform Fees',
      value: CurrencyFormatter.format(totalCommission),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4-9 4-9-4z" />
        </svg>
      ),
      color: 'red'
    },
    {
      label: 'Avg. Rate',
      value: `${avgCommissionRate}%`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue'
    }
  ];

  const colorClasses = {
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Commission Reports
          </h2>
        </div>
        
        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
          {commissions.length} Orders
        </span>
      </div>

      {/* Summary Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <MasonryGrid
          items={summaryStats}
          columnCount={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
          gap={12}
          renderItem={(stat) => (
            <div className={`flex items-center p-3 rounded-lg border ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
              <div className="p-1.5 rounded-md bg-white dark:bg-gray-900 mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-sm font-bold">
                  {stat.value}
                </p>
              </div>
            </div>
          )}
        />
      </div>

      {/* Download Button */}
      <button
        onClick={() => onDownloadReport('All Time')}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Download Report
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download detailed commission summary
            </p>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}