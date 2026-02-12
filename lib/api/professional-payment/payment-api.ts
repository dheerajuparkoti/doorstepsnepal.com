import { api } from '@/config/api-client';
import { Payment, PaymentCreateRequest, PaymentSummary, PaymentCompleteResponse } from '@/lib/data/professional/payment';

export class PaymentApi {
  private static baseUrl = '/orders-payment';

  /**
   * Get payments for a specific order
   */
  static async getPaymentsByOrder(
    orderId: number,
    skip = 0,
    limit = 100
  ): Promise<Payment[]> {
    return api.get(`${this.baseUrl}/`, {
      params: { order_id: orderId, skip, limit },
    });
  }

  /**
   * Get payment summary for an order
   */
  static async getPaymentSummary(orderId: number): Promise<PaymentSummary> {
    return api.get(`${this.baseUrl}/summary/${orderId}`);
  }

  /**
   * Create new payment
   */
  static async createPayment(request: PaymentCreateRequest): Promise<Payment> {
    return api.post(`${this.baseUrl}/`, request);
  }

  /**
   * Mark payment completed
   */
  static async markPaymentCompleted(paymentId: number): Promise<PaymentCompleteResponse> {
    return api.patch(`${this.baseUrl}/${paymentId}/complete`);
  }
}


