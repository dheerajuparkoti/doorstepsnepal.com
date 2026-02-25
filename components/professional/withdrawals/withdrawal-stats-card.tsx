import React from 'react';
import { WithdrawalStats } from '@/lib/data/professional/withdrawal';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WithdrawalStatsCardProps {
  stats: WithdrawalStats;
  onDownloadPDF: () => void;
}

export function WithdrawalStatsCard({ stats, onDownloadPDF }: WithdrawalStatsCardProps) {
  const { language } = useI18n();

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  const statItems = [
    {
      label: getLocalizedText('Total Requests', 'कुल अनुरोध'),
      value: stats.totalRequests,
      icon: 'receipt',
      color: 'blue',
    },
    {
      label: getLocalizedText('Completed', 'पूरा'),
      value: stats.completed,
      icon: 'check',
      color: 'green',
    },
    {
      label: getLocalizedText('Pending', 'पेन्डिङ'),
      value: stats.pending,
      icon: 'clock',
      color: 'amber',
    },
    {
      label: getLocalizedText('Rejected', 'अस्वीकृत'),
      value: stats.rejected,
      icon: 'x',
      color: 'red',
    },
  ];

  const getIcon = (icon: string) => {
    const className = "w-5 h-5";
    switch (icon) {
      case 'receipt':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'check':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'clock':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'x':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Theme-aware color classes for icons (use semantic opacities)
  const iconColorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl p-6 shadow-lg border border-border">
      {/* Total Withdrawn Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {getLocalizedText('Total Withdrawn', 'कुल निकासी')}
          </p>
          <p className="text-2xl md:text-3xl font-bold">
            {CurrencyFormatter.format(stats.totalAmount)}
          </p>
        </div>
        <Button
          onClick={onDownloadPDF}
          variant="default" // or "outline" – adjust as needed
          className="gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{getLocalizedText('Download PDF', 'पीडीएफ डाउनलोड गर्नुहोस्')}</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-muted/50 rounded-xl p-4 border border-border hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1.5 rounded-full ${iconColorClasses[item.color as keyof typeof iconColorClasses]}`}>
                {getIcon(item.icon)}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-xl font-bold tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm text-muted-foreground">
        <span>
          {getLocalizedText('Success Rate', 'सफलता दर')}:{' '}
          {stats.totalRequests > 0
            ? Math.round((stats.completed / stats.totalRequests) * 100)
            : 0}
          %
        </span>
  
      </div>
    </div>
  );
}