import React from 'react';
import { WithdrawalStatus } from '@/lib/data/professional/withdrawal';
import { useI18n } from '@/lib/i18n/context';

interface WithdrawalFiltersProps {
  quickFilters: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', neLabel: 'पेन्डिङ', color: 'amber' },
  { value: 'approved', label: 'Approved', neLabel: 'स्वीकृत', color: 'blue' },
  { value: 'rejected', label: 'Rejected', neLabel: 'अस्वीकृत', color: 'red' },
  { value: 'completed', label: 'Completed', neLabel: 'पूरा', color: 'green' }
];

export function WithdrawalFilters({
  quickFilters,
  selectedFilter,
  onFilterChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  showClearButton
}: WithdrawalFiltersProps) {
  const { language } = useI18n();

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  const getStatusLabel = (status: typeof statusOptions[0]) => {
    return language === 'ne' ? status.neLabel : status.label;
  };

  const getFilterLabel = (filter: string) => {
    const filterTranslations: Record<string, { en: string; ne: string }> = {
      Today: { en: 'Today', ne: 'आज' },
      Yesterday: { en: 'Yesterday', ne: 'हिजो' },
      'This Week': { en: 'This Week', ne: 'यस हप्ता' },
      'This Month': { en: 'This Month', ne: 'यस महिना' },
      'Last Month': { en: 'Last Month', ne: 'गत महिना' },
      'This Year': { en: 'This Year', ne: 'यस वर्ष' }
    };

    return filterTranslations[filter]
      ? language === 'ne'
        ? filterTranslations[filter].ne
        : filterTranslations[filter].en
      : filter;
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border p-4 space-y-4">
      {/* Quick Filters */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {getLocalizedText('QUICK FILTERS', 'द्रुत फिल्टर')}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  selectedFilter === filter
                    ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 border border-transparent'
                    : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                }
              `}
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {getLocalizedText('STATUS FILTER', 'स्थिति फिल्टर')}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange(null)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                !selectedStatus
                  ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 border border-transparent'
                  : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
              }
            `}
          >
            {getLocalizedText('All Statuses', 'सबै स्थिति')}
          </button>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  selectedStatus === status.value
                    ? `bg-${status.color}-500 text-white shadow-md hover:bg-${status.color}-600 border border-transparent`
                    : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                }
              `}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {showClearButton && (
        <div className="pt-2">
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>{getLocalizedText('Clear all filters', 'सबै फिल्टर हटाउनुहोस्')}</span>
          </button>
        </div>
      )}
    </div>
  );
}