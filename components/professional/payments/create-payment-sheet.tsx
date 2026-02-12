
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BottomSheet } from '@/components/ui/professional-payment/bottom-sheet';
import { PaymentMethod, PaymentCreateRequest } from '@/lib/data/professional/payment';
import { PAYMENT_CONSTANTS } from '@/lib/data/professional/constants';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { ProperCaseFormatter } from '@/lib/utils/formatters';
import { QRCodeSection } from './qr-code-section';
import { PaymentApi } from '@/lib/api/professional-payment/payment-api';


const paymentSchema = z.object({
  amount: z.number()
    .min(PAYMENT_CONSTANTS.MINIMUM_AMOUNT, `Minimum payment is Rs. ${PAYMENT_CONSTANTS.MINIMUM_AMOUNT}`)
    .max(1000000, 'Maximum payment is Rs. 10,00,000'),
  payment_method: z.nativeEnum(PaymentMethod),
  transaction_id: z.string().optional(), 
  notes: z.string().max(100, 'Notes cannot exceed 100 characters').optional()
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CreatePaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  remainingAmount: number;
  isProfessional?: boolean;
  onPaymentSuccess: () => void;
}

export function CreatePaymentSheet({
  isOpen,
  onClose,
  orderId,
  remainingAmount,
  isProfessional = false,
  onPaymentSuccess
}: CreatePaymentSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    setError
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: PaymentMethod.CASH,
      transaction_id: '',
      notes: ''
    }
  });

  const amount = watch('amount');
  const selectedMethod = watch('payment_method');

  const onSubmit = async (data: PaymentFormData) => {
    // For professionals, show confirmation dialog first
    if (isProfessional && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Prepare the payment request according to API schema
      const paymentRequest: PaymentCreateRequest = {
        order_id: orderId,
        amount: data.amount,
        payment_method: data.payment_method,
        transaction_id: data.transaction_id || undefined,
        notes: data.notes || undefined,
        is_professional: isProfessional,
        payment_status: 'pending' 
      };

      // Call the API
      const newPayment = await PaymentApi.createPayment(paymentRequest);
      
      // Success
      onPaymentSuccess();
      reset();
      setShowConfirmation(false);
      setApiError(null);
      
    } catch (error: any) {
      console.error('Failed to create payment:', error);
      
      // Handle API error response
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.data?.detail) {
        setApiError(error.response.data.detail);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('Failed to create payment. Please try again.');
      }
      
      // If there's a field-specific error, set it on the form
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setError(field as any, { 
            type: 'manual', 
            message: message as string 
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setShowConfirmation(false);
    setApiError(null);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleCancel}
      title={showConfirmation ? 'Confirm Payment' : 'Add Payment'}
    >
      <div className="p-4 space-y-6">
        {/* API Error Message */}
        {apiError && !showConfirmation && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700 dark:text-red-300">
                {apiError}
              </p>
            </div>
          </div>
        )}

        {!showConfirmation ? (
          <>
            {/* Remaining Balance Info */}
            {remainingAmount > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Remaining balance: {CurrencyFormatter.format(remainingAmount)}
                  </p>
                </div>
              </div>
            )}

            {/* Professional Risk Warning */}
            {isProfessional && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      Professional Action Required
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      By adding this payment, you confirm that you have received this amount from the customer. This is a legally binding digital entry.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Amount Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  Rs.
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border
                    ${errors.amount 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                    }
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
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

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Method
              </label>
              <select
                {...register('payment_method')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              >
                {Object.values(PaymentMethod).map((method) => (
                  <option key={method} value={method}>
                    {method.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* QR Code Section */}
            {selectedMethod && amount > 0 && (
              <QRCodeSection
                method={selectedMethod}
                amount={amount}
              />
            )}

            {/* Transaction ID (Optional) - Updated field name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                {...register('transaction_id')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter transaction ID"
              />
            </div>

            {/* Notes (Optional) */}
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
                onChange={(e) => {
                  e.target.value = ProperCaseFormatter.format(e.target.value);
                  register('notes').onChange(e);
                }}
              />
            </div>
          </>
        ) : (
          // Confirmation Dialog
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Payment Initiation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You are about to record a payment of {CurrencyFormatter.format(amount)} via {selectedMethod}.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Professional Responsibility:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>You confirm receiving this amount from the customer</li>
                <li>This is a legally binding digital entry</li>
                <li>False entries may lead to account suspension</li>
                <li>This action will be recorded in the system</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'I Understand, Confirm'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons (only shown when not confirming) */}
        {!showConfirmation && (
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Payment'
              )}
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}