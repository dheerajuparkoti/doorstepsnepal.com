
import React from 'react';
import { WithdrawalStatus } from '@/lib/data/professional/withdrawal';

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
  { value: 'pending', label: 'Pending', color: 'amber' },
  { value: 'approved', label: 'Approved', color: 'blue' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'completed', label: 'Completed', color: 'green' }
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Quick Filters */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          QUICK FILTERS
        </p>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedFilter === filter
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          STATUS FILTER
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange(null)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${!selectedStatus
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            All Statuses
          </button>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedStatus === status.value
                  ? `bg-${status.color}-100 dark:bg-${status.color}-900/40 text-${status.color}-700 dark:text-${status.color}-300 border-2 border-${status.color}-500`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {showClearButton && (
        <div className="pt-2">
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
}