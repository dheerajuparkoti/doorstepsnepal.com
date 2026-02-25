import React from 'react';
import { OrderCommission } from '@/lib/data/professional/commission';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { useI18n } from '@/lib/i18n/context';

interface CommissionReportsProps {
  commissions: OrderCommission[];
  onDownloadReport: (period?: string) => Promise<void>;
}

export function CommissionReports({ commissions, onDownloadReport }: CommissionReportsProps) {
  const { t, language } = useI18n();

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  if (commissions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {getLocalizedText('No Commission Reports', 'कमिसन रिपोर्ट छैन')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {getLocalizedText('Complete orders to see your earnings', 'आफ्नो आम्दानी हेर्न अर्डर पूरा गर्नुहोस्')}
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
      label: getLocalizedText('Total Orders', 'कुल अर्डर'),
      value: commissions.length.toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'amber',
      subtitle: getLocalizedText('Total completed orders', 'पूरा भएका अर्डरहरू')
    },
    {
      label: getLocalizedText('Net Earnings', 'खुद आम्दानी'),
      value: CurrencyFormatter.format(netEarnings),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      subtitle: getLocalizedText('After platform fees', 'प्लेटफर्म शुल्क पछि')
    },
    {
      label: getLocalizedText('Platform Fees', 'प्लेटफर्म शुल्क'),
      value: CurrencyFormatter.format(totalCommission),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4-9 4-9-4z" />
        </svg>
      ),
      color: 'red',
      subtitle: getLocalizedText('Total commission paid', 'कुल कमिसन भुक्तानी')
    },
    {
      label: getLocalizedText('Avg. Rate', 'औसत दर'),
      value: `${avgCommissionRate}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue',
      subtitle: getLocalizedText('Average commission rate', 'औसत कमिसन दर')
    }
  ];

  const colorClasses = {
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
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
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getLocalizedText('Commission Reports', 'कमिसन रिपोर्ट')}
          </h2>
        </div>
        
        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
          {getLocalizedText(`${commissions.length} Orders`, `${commissions.length} अर्डरहरू`)}
        </span>
      </div>

      {/* Simple flexbox with automatic wrapping */}
      <div className="flex flex-wrap gap-4">
        {summaryStats.map((stat) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          
          return (
            <div
              key={stat.label}
              className={`
                flex-1 min-w-[200px] p-4 rounded-xl border ${colors.border} ${colors.bg}
                transition-all hover:shadow-md hover:scale-[1.02] duration-200
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <div className={colors.text}>
                    {stat.icon}
                  </div>
                </div>
                <span className={`text-xs ${colors.text}`}>
                  {stat.subtitle}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              
              <p className={`text-xl font-bold ${colors.text}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Download Button */}
      <button
        onClick={() => onDownloadReport(getLocalizedText('All Time', 'सबै समय'))}
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
              {getLocalizedText('Download Report', 'रिपोर्ट डाउनलोड गर्नुहोस्')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getLocalizedText('Download detailed commission summary', 'विस्तृत कमिसन सारांश डाउनलोड गर्नुहोस्')}
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