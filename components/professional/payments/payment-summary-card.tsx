
import React, { useEffect, useState } from 'react';
import { PaymentSummary } from '@/lib/data/professional/payment';
import { CurrencyFormatter } from '@/lib/utils/formatters';

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
  completedCount: number;
  pendingCount: number;
  totalCompletedAmount: number;
}




export function PaymentSummaryCard({
  summary,
  completedCount,
  pendingCount,
  totalCompletedAmount
}: PaymentSummaryCardProps) {
  const isFullyPaid = summary.payment_status === 'paid';
  const isPartiallyPaid = summary.payment_status === 'partial';
  const isUnpaid= summary.payment_status==='unpaid';
    const [width, setWidth] = useState(0);
  //  const isPending = summary.paymentStatus === 'pending';
  //  const isFullyPaid = summary.paymentStatus === 'completed';
  const statusConfig = {
    paid: {
      label: 'Paid',
      color: 'green',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800'
    },
    partial: {
      label: 'Partially Paid',
      color: 'orange',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800'
    },
    unpaid: {
      label: 'Unpaid',
      color: 'gray',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800'
    }
  };



const paymentPercentage = Number(summary.payment_percentage) || 0;
console.log("pAYMENTE PERCENTAGE",pendingCount,completedCount,totalCompletedAmount);

  const status = statusConfig[summary.payment_status];
    useEffect(() => {
    setWidth(paymentPercentage);
  }, [paymentPercentage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Summary
          </h3>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${status?.bg} ${status?.text} ${status?.border} border`}>
          {status?.label}
        </span>
      </div>

    
 {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.min(width, 100).toFixed(1)}% Paid
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {CurrencyFormatter.format(summary.total_paid ?? 0)} / {CurrencyFormatter.format(summary.total_price ?? 0)}
          </span>
        </div>
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div
    className={`h-full rounded-full transition-all duration-1000 ${
      isFullyPaid
        ? 'bg-green-500'
        : isPartiallyPaid
        ? 'bg-amber-500'
        : 'bg-gray-400'
    }`}
    style={{ width: `${Math.min(width, 100)}%` }}
  />
</div>
</div>

    


      {/* Amount Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
           
            {CurrencyFormatter.format(summary.total_price)}
          </p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">Paid</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            {CurrencyFormatter.format(summary.total_paid)}
          </p>
        </div>
        <div className={`p-3 rounded-lg border ${
          summary.remaining_amount > 0
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}>
          <p className={`text-xs ${
            summary.remaining_amount > 0
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-green-600 dark:text-green-400'
          } mb-1`}>
            Remaining
          </p>
          <p className={`text-lg font-bold ${
            summary.remaining_amount > 0
              ? 'text-orange-700 dark:text-orange-300'
              : 'text-green-700 dark:text-green-300'
          }`}>
            {CurrencyFormatter.format(summary.remaining_amount)}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} Completed
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {pendingCount} Pending
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {CurrencyFormatter.format(totalCompletedAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}