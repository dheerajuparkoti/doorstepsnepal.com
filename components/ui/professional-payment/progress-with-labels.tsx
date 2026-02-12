// components/ui/ProgressWithLabel.tsx
import React from 'react';
import { CurrencyFormatter } from '@/lib/utils/formatters';

interface ProgressWithLabelProps {
  value: number;
  min?: number;
  max?: number;
  currentLabel?: string;
  minLabel?: string;
  maxLabel?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressWithLabel({
  value,
  min = 0,
  max = 1000,
  currentLabel = 'Current',
  minLabel = 'Rs. 0',
  maxLabel = 'Rs. 1000',
  showPercentage = true,
  className = ''
}: ProgressWithLabelProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const isEligible = value >= max;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {currentLabel}
        </span>
        <span className="text-xs font-semibold text-gray-900 dark:text-white">
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
            isEligible ? 'bg-green-500' : 'bg-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {minLabel}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {maxLabel}
        </span>
      </div>
      
      {showPercentage && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {isEligible 
            ? '✓ Eligible for withdrawal'
            : `${CurrencyFormatter.formatWithoutSymbol(max - value)} more needed to withdraw`
          }
        </p>
      )}
    </div>
  );
}