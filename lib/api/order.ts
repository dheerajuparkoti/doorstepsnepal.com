import { api } from '@/config/api-client';

import { 
  Order, 
  OrdersResponse, 
  OrderFilters, 
  CreateOrderDTO, 
  UpdateOrderDTO 
} from '@/lib/data/order';

export class OrderAPI {
  // Get orders with filters
  // static async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
  //   try {
  //     return await api.get<OrdersResponse>('/orders', {
  //       params: filters,
  //       cache: 'no-store',
  //     });
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //     throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders');
  //   }
  // }

   static async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    try {
      return await api.get<OrdersResponse>('/orders', {
        params: filters,
        cache: 'no-store',
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
     
      if (error.response?.status === 404 || error.message.includes('404')) {
        return {
          orders: [],
          total: 0,
          page: 1,
          per_page: filters.per_page || 10,
          total_pages: 0,
        };
      }
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  // Get orders by customer ID
  static async getOrdersByCustomer(
    customerId: number, 
    page: number = 1, 
    perPage: number = 10
  ): Promise<OrdersResponse> {
    try {
      console.log(`Fetching orders for customer ${customerId}...`);
      
      const response = await api.get<OrdersResponse>(`/orders/customer/${customerId}`, {
        params: { page, per_page: perPage },
        cache: 'no-store',
      });
      
      console.log(`Fetched ${response.orders?.length || 0} orders for customer ${customerId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : `Failed to fetch orders for customer ${customerId}`
      );
    }
  }

  // Get order by ID
  static async getOrderById(orderId: number): Promise<Order> {
    try {
      if (!orderId || isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }

      return await api.get<Order>(`/orders/${orderId}`, {
        cache: 'no-store',
      });
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : `Failed to fetch order ${orderId}`
      );
    }
  }

  // Create new order
  static async createOrder(orderData: CreateOrderDTO): Promise<Order> {
    try {
      return await api.post<Order>('/orders', orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to create order'
      );
    }
  }

  // Update order
  static async updateOrder(orderId: number, updateData: UpdateOrderDTO): Promise<Order> {
    try {
      if (!orderId || isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }

      return await api.patch<Order>(`/orders/${orderId}`, updateData);
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : `Failed to update order ${orderId}`
      );
    }
  }

  // Delete order
  static async deleteOrder(orderId: number): Promise<void> {
    try {
      if (!orderId || isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }

      await api.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : `Failed to delete order ${orderId}`
      );
    }
  }

  // Get customer orders with pagination and better error handling
  static async getCustomerOrders(
    customerId: number,
    page: number = 1,
    perPage: number = 10
  ): Promise<OrdersResponse> {
    try {
      return await this.getOrdersByCustomer(customerId, page, perPage);
    } catch (error) {
      // If 404 or customer not found, return empty orders
      if (error instanceof Error && 
          (error.message.includes('404') || 
           error.message.includes('not found') ||
           error.message.includes('Invalid customer'))) {
        return {
          orders: [],
          total: 0,
          page,
          per_page: perPage,
          total_pages: 0
        };
      }
      throw error;
    }
  }
}