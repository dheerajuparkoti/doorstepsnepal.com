import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BottomSheet } from '@/components/ui/professional-payment/bottom-sheet';
import { CurrencyFormatter, ProperCaseFormatter } from '@/lib/utils/formatters';
import { WITHDRAWAL_CONSTANTS } from '@/lib/data/professional/constants';
import { WithdrawalCreateRequest } from '@/lib/data/professional/withdrawal';
import { useI18n } from '@/lib/i18n/context';
import { getWithdrawalSchema, WithdrawalFormData } from '@/lib/schemas/withdrawal-schema';
import { toast } from 'sonner';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';

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
  const { t, language } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  
  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    getValues,
    setError
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(getWithdrawalSchema(getLocalizedText)),
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



  

  const handleWithdrawalSubmit = async (data: WithdrawalFormData) => {
    if (!isEligible) return;
    
    // Show confirmation dialog first
    const confirmed = await confirm({
      title: getLocalizedText('Confirm Withdrawal', 'निकासी पुष्टि गर्नुहोस्'),
      description: getLocalizedText(
        `Are you sure you want to withdraw ${CurrencyFormatter.format(data.amount)}?`,
        `के तपाईं ${CurrencyFormatter.format(data.amount)} निकासी गर्न निश्चित हुनुहुन्छ?`
      ),
      confirmText: getLocalizedText('Yes, Withdraw', 'हो, निकासी गर्नुहोस्'),
      cancelText: getLocalizedText('Cancel', 'रद्द गर्नुहोस्'),
      variant: 'default',
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(data.amount, data.notes);
      if (success) {
        onClose();
        toast.success(
          getLocalizedText(
            `Withdrawal request of ${CurrencyFormatter.format(data.amount)} has been submitted successfully`,
            `${CurrencyFormatter.format(data.amount)} को निकासी अनुरोध सफलतापूर्वक पेश गरिएको छ`
          ),
          {
            description: getLocalizedText(
              'You will be notified once the transfer is processed',
              'स्थानान्तरण प्रक्रिया भएपछि तपाईंलाई सूचित गरिनेछ'
            )
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitForm = handleSubmit(handleWithdrawalSubmit);

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={getLocalizedText('Withdraw Funds', 'रकम निकासी')}
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
                  {getLocalizedText('Available Balance', 'उपलब्ध ब्यालेन्स')}
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
                    <span className="text-xs font-medium">{getLocalizedText('Eligible', 'योग्य')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium">{getLocalizedText('Not Eligible', 'अयोग्य')}</span>
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
                    {getLocalizedText('Need', 'आवश्यक')} {CurrencyFormatter.format(remainingForEligibility)} {getLocalizedText('more', 'थप')}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${eligibilityPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>रू 0</span>
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
                    {getLocalizedText('Minimum withdrawal required', 'न्यूनतम निकासी आवश्यक')}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    {getLocalizedText('You need', 'तपाईंलाई')} {CurrencyFormatter.format(remainingForEligibility)} {getLocalizedText('more to withdraw', 'थप निकासीको लागि आवश्यक छ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Amount Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {getLocalizedText('Withdrawal Amount', 'निकासी रकम')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                रू
              </span>
             <input
  type="number"
  step={10}
  {...register('amount', { 
    valueAsNumber: true,
    onChange: (e) => {
      const value = Number(e.target.value);
      if (value > availableBalance) {
        setError('amount', {
          type: 'manual',
          message: getLocalizedText(
            `Amount cannot exceed available balance of ${CurrencyFormatter.format(availableBalance)}`,
            `रकम उपलब्ध ब्यालेन्स ${CurrencyFormatter.format(availableBalance)} भन्दा बढी हुन सक्दैन`
          )
        });
      }
    }
  })}
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
  placeholder={getLocalizedText('Enter amount', 'रकम प्रविष्ट गर्नुहोस्')}
  max={availableBalance} // Add max attribute
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
              {getLocalizedText('Quick Amounts', 'द्रुत रकम')}
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
                  {amt === availableBalance 
                    ? getLocalizedText('Max', 'अधिकतम') 
                    : CurrencyFormatter.formatWithoutSymbol(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {getLocalizedText('Notes', 'नोटहरू')} ({getLocalizedText('Optional', 'वैकल्पिक')})
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              placeholder={getLocalizedText('Add any additional information...', 'कुनै अतिरिक्त जानकारी थप्नुहोस्...')}
              onChange={(e) => {
                const formatted = ProperCaseFormatter.format(e.target.value);
                setValue('notes', formatted, { shouldValidate: true, shouldDirty: true });
              }}
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
                  {getLocalizedText('Processing Information', 'प्रक्रिया जानकारी')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getLocalizedText(
                    'Withdrawals are processed within 3-5 business days. You\'ll be notified when the transfer is complete.',
                    'निकासी ३-५ कार्य दिन भित्र प्रक्रिया गरिन्छ। स्थानान्तरण पूरा भएपछि तपाईंलाई सूचित गरिनेछ।'
                  )}
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
              {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
            </button>
            <button
              type="button"
              onClick={onSubmitForm}
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
                  {getLocalizedText('Processing...', 'प्रक्रिया हुँदै...')}
                </span>
              ) : (
                getLocalizedText('Submit Request', 'अनुरोध पेश गर्नुहोस्')
              )}
            </button>
          </div>
        </div>
      </BottomSheet>
      <ConfirmationDialog />
    </>
  );
}