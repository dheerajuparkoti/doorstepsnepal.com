
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BottomSheet } from '@/components/ui/professional-payment/bottom-sheet';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { WITHDRAWAL_CONSTANTS } from '@/lib/data/professional/constants';
import { WithdrawalCreateRequest } from '@/lib/data/professional/withdrawal';

const withdrawalSchema = z.object({
  amount: z.number()
    .min(WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL, `Minimum withdrawal is Rs. ${WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL}`)
    .max(1000000, 'Maximum withdrawal is Rs. 10,00,000'),
  notes: z.string().max(100, 'Notes cannot exceed 100 characters').optional()
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  professional_id: number;
  availableBalance: number;
  onSubmit: (amount: number, notes?: string) => Promise<boolean>;
}

export function WithdrawalRequestSheet({
  isOpen,
  onClose,
  professional_id,
  availableBalance,
  onSubmit
}: WithdrawalRequestSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL,
      notes: ''
    }
  });

  const amount = watch('amount');
  const isEligible = availableBalance >= WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL;
  const remainingForEligibility = WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL - availableBalance;
  const eligibilityPercent = Math.min(100, (availableBalance / WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL) * 100);

  const quickAmounts = [
    WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL,
    2000,
    5000,
    10000,
    availableBalance
  ];

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: Math.min(WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL, availableBalance),
        notes: ''
      });
    }
  }, [isOpen, availableBalance, reset]);

  const onSubmitForm = async (data: WithdrawalFormData) => {
    if (!isEligible) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data.amount, data.notes);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Withdraw Funds"
    >
      <div className="p-4 space-y-6">
        {/* Balance Info Card */}
        <div className={`
          p-4 rounded-xl border
          ${isEligible 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
          }
        `}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available Balance
              </p>
              <p className={`text-2xl font-bold ${isEligible ? 'text-green-600' : 'text-primary-600'}`}>
                {CurrencyFormatter.format(availableBalance)}
              </p>
            </div>
            <div className={`
              flex items-center space-x-1 px-2.5 py-1.5 rounded-full
              ${isEligible 
                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' 
                : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
              }
            `}>
              {isEligible ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium">Eligible</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">Not Eligible</span>
                </>
              )}
            </div>
          </div>

          {!isEligible && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {eligibilityPercent.toFixed(0)}%
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Need {CurrencyFormatter.format(remainingForEligibility)} more
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${eligibilityPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Rs. 0</span>
                <span>{CurrencyFormatter.format(WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ineligibility Warning */}
        {!isEligible && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  Minimum withdrawal required
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  You need {CurrencyFormatter.format(remainingForEligibility)} more to withdraw
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Amount Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Withdrawal Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              Rs.
            </span>
            <input
              type="number"
              {...register('amount', { valueAsNumber: true })}
              disabled={!isEligible}
              className={`
                w-full pl-10 pr-4 py-3 rounded-xl border
                ${errors.amount 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                }
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                disabled:bg-gray-100 dark:disabled:bg-gray-800/50 disabled:cursor-not-allowed
              `}
              placeholder="Enter amount"
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Amounts
          </p>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setValue('amount', amt, { shouldValidate: true })}
                disabled={!isEligible || amt > availableBalance}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${amount === amt
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {amt === availableBalance ? 'Max' : CurrencyFormatter.formatWithoutSymbol(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
            placeholder="Add any additional information..."
          />
          {errors.notes && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* Processing Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Processing Information
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Withdrawals are processed within 3-5 business days. You'll be notified when the transfer is complete.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmitForm)}
            disabled={!isEligible || isSubmitting}
            className={`
              flex-1 px-4 py-3 font-medium rounded-xl transition-colors
              ${isEligible
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}