import { api } from '@/config/api-client';
import { Payment, PaymentCreateRequest, PaymentSummary, PaymentCompleteResponse } from '@/lib/data/professional/payment';

// export class PaymentApi {
//   private static baseUrl = '/orders-payment';

//   /**
//    * Get payments for a specific order
//    */
//   static async getPaymentsByOrder(
//     orderId: number,
//     skip = 0,
//     limit = 100
//   ): Promise<Payment[]> {
//     return api.get(`${this.baseUrl}/`, {
//       params: { order_id: orderId, skip, limit },
//     });
//   }

//   /**
//    * Get payment summary for an order
//    */
//   static async getPaymentSummary(orderId: number): Promise<PaymentSummary> {
//     return api.get(`${this.baseUrl}/summary/${orderId}`);
//   }

//   /**
//    * Create new payment
//    */
//   static async createPayment(request: PaymentCreateRequest): Promise<Payment> {
//     return api.post(`${this.baseUrl}/`, request);
//   }

//   /**
//    * Mark payment completed
//    */
//   static async markPaymentCompleted(paymentId: number): Promise<PaymentCompleteResponse> {
//     return api.patch(`${this.baseUrl}/${paymentId}/complete`);
//   }
// }

// helper for safe GET with 404 fallback
async function safeGet<T>(url: string, defaultValue: T): Promise<T> {
  try {
    return await api.get<T>(url);
  } catch (error: any) {
    console.warn(`Safe GET failed for ${url}:`, error.message || error);
    if (error.response?.status === 404 || error.message.includes('404')) {
      return defaultValue; // return safe default
    }
    throw error; // throw real errors
  }
}

export class PaymentApi {
  private static baseUrl = '/orders-payment';

  static async getPaymentsByOrder(orderId: number, skip = 0, limit = 100) {
    return safeGet(`${this.baseUrl}/?order_id=${orderId}&skip=${skip}&limit=${limit}`, []);
  }

  static async getPaymentSummary(orderId: number) {
    return safeGet(`${this.baseUrl}/summary/${orderId}`, {
      total_paid: 0,
      total_due: 0,
    });
  }

  static async createPayment(request: PaymentCreateRequest) {
    return api.post(`${this.baseUrl}/`, request);
  }

  static async markPaymentCompleted(paymentId: number) {
    return api.patch(`${this.baseUrl}/${paymentId}/complete`);
  }
}
