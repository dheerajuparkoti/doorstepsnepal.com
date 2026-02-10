import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { OrderAPI } from '@/lib/api/order';
import { 
  Order, 
  OrdersResponse, 
  OrderFilters, 
  CreateOrderDTO, 
  UpdateOrderDTO,
  OrderStatus,
  PaymentStatus 
} from '@/lib/data/order';

interface OrderState {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  filters: OrderFilters;

  // Actions
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  
  // CRUD Operations
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchCustomerOrders: (customerId: number) => Promise<void>;
  fetchOrderById: (orderId: number) => Promise<void>;
  createOrder: (orderData: CreateOrderDTO) => Promise<Order>;
  updateOrder: (orderId: number, updateData: UpdateOrderDTO) => Promise<void>;
  deleteOrder: (orderId: number) => Promise<void>;
  
  // Status Updates
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: number, status: PaymentStatus) => Promise<void>;
  
  // Utility
  getOrder: (orderId: number) => Order | undefined;
  getFilteredOrders: (status?: OrderStatus) => Order[];
  clearCurrentOrder: () => void;
  clearError: () => void;
  
}



const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  },
  filters: {
    page: 1,
    per_page: 10,
  },
  
};

export const useOrderStore = create<OrderState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
          }));
        },

        clearFilters: () => {
          set({ filters: initialState.filters });
        },

        fetchOrders: async (filters = {}) => {
          set({ isLoading: true, error: null });
          try {
            const currentFilters = get().filters;
            const mergedFilters = { ...currentFilters, ...filters };
            
            const response = await OrderAPI.getOrders(mergedFilters);
            
            set({
              orders: response.orders,
              pagination: {
                total: response.total,
                page: response.page,
                per_page: response.per_page,
                total_pages: response.total_pages,
              },
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch orders',
              isLoading: false,
            });
          }
        },

        fetchCustomerOrders: async (customerId: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await OrderAPI.getOrdersByCustomer(customerId);
            
            set({
              orders: response.orders,
              pagination: {
                total: response.total,
                page: response.page,
                per_page: response.per_page,
                total_pages: response.total_pages,
              },
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch customer orders',
              isLoading: false,
            });
          }
        },

        fetchOrderById: async (orderId: number) => {
          set({ isLoading: true, error: null });
          try {
            const order = await OrderAPI.getOrderById(orderId);
            set({
              currentOrder: order,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch order',
              isLoading: false,
            });
          }
        },

        createOrder: async (orderData: CreateOrderDTO): Promise<Order> => {
          set({ isLoading: true, error: null });
          try {
            const newOrder = await OrderAPI.createOrder(orderData);
            
            set((state) => ({
              orders: [newOrder, ...state.orders],
              currentOrder: newOrder,
              isLoading: false,
            }));
            
            return newOrder;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
            set({
              error: errorMessage,
              isLoading: false,
            });
            throw new Error(errorMessage);
          }
        },

        updateOrder: async (orderId: number, updateData: UpdateOrderDTO) => {
          set({ isLoading: true, error: null });
          try {
            const updatedOrder = await OrderAPI.updateOrder(orderId, updateData);
            
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId ? updatedOrder : order
              ),
              currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update order',
              isLoading: false,
            });
          }
        },

        deleteOrder: async (orderId: number) => {
          set({ isLoading: true, error: null });
          try {
            await OrderAPI.deleteOrder(orderId);
            
            set((state) => ({
              orders: state.orders.filter((order) => order.id !== orderId),
              currentOrder: state.currentOrder?.id === orderId ? null : state.currentOrder,
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete order',
              isLoading: false,
            });
          }
        },

        updateOrderStatus: async (orderId: number, status: OrderStatus) => {
          await get().updateOrder(orderId, { order_status: status });
        },

        updatePaymentStatus: async (orderId: number, status: PaymentStatus) => {
          await get().updateOrder(orderId, { payment_status: status });
        },

        getOrder: (orderId: number) => {
          return get().orders.find((order) => order.id === orderId);
        },

        getFilteredOrders: (status?: OrderStatus) => {
          const orders = get().orders;
          if (!status) return orders;
          return orders.filter((order) => order.order_status === status);
        },


         getOrdersByStatus: (status?: OrderStatus) => {
          const orders = get().orders;
          if (!status) return orders;
          return orders.filter((order) => order.order_status === status);
        },

  

        clearCurrentOrder: () => {
          set({ currentOrder: null });
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'order-storage',
        partialize: (state) => ({
          orders: state.orders,
          filters: state.filters,
        }),
      }
    ),
    { name: 'OrderStore' }
  )
  
);




