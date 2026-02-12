
import { useEffect, useCallback } from 'react';
import { usePaymentStore } from '@/stores/professional/payment-store';
import { PaymentApi } from '@/lib/api/professional-payment/payment-api';
import { PDFService } from '@/lib/services/pdf-services';
import { Payment, PaymentCreateRequest } from '@/lib/data/professional/payment';

export function usePayments(orderId: number) {
  const {
    payments,
    paymentSummary,
    isLoading,
    error,
    setPayments,
    setPaymentSummary,
    setLoading,
    setError,
    clearPayments,
    completedPayments,
    pendingPayments,
    totalCompletedAmount
  } = usePaymentStore();

  const loadPayments = useCallback(async () => {
    if (!orderId || orderId <= 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [paymentsData, summaryData] = await Promise.all([
        PaymentApi.getPaymentsByOrder(orderId),
        PaymentApi.getPaymentSummary(orderId)
      ]);
      
      setPayments(paymentsData);
      setPaymentSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [orderId, setPayments, setPaymentSummary, setLoading, setError]);

  const createPayment = useCallback(async (request: PaymentCreateRequest) => {
    setLoading(true);
    
    try {
      const newPayment = await PaymentApi.createPayment(request);
      setPayments([newPayment, ...payments]);
      
      // Refresh summary
      const summary = await PaymentApi.getPaymentSummary(orderId);
      setPaymentSummary(summary);
      
      return newPayment; // Return the payment object, not boolean
    } catch (err: any) {
      setError(err.message || 'Failed to create payment');
      throw err; // Throw error for component to handle
    } finally {
      setLoading(false);
    }
  }, [orderId, payments, setPayments, setPaymentSummary, setLoading, setError]);

  const downloadPaymentReceipt = useCallback(async (payment: Payment): Promise<void> => {
    try {
      // You might want to fetch order details here
      const order = { id: orderId }; // Placeholder
      
      await PDFService.generatePaymentReceipt(
        payment,
        order,
        {
          name: 'Doorsteps Nepal',
          address: 'Kathmandu, Nepal',
          phone: '+977-9851407706, +977-9851407707',
          email: 'info@doorstepsnepal.com'
        }
      );
    } catch (err) {
      console.error('Failed to generate receipt:', err);
      // Optionally show toast notification here
    }
  }, [orderId]);

  // Auto-load on mount
  useEffect(() => {
    if (orderId && orderId > 0) {
      loadPayments();
    }
    
    return () => {
      clearPayments();
    };
  }, [loadPayments, clearPayments, orderId]);

  return {
    // Data
    payments,
    paymentSummary,
    
    // UI State
    isLoading,
    error,
    
    // Computed
    completedPayments: completedPayments(),
    pendingPayments: pendingPayments(),
    totalCompletedAmount: totalCompletedAmount(),
    
    // Actions
    loadPayments,
    createPayment,
    downloadPaymentReceipt, // Now returns Promise<void>
  };
}