
import { useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { useNotificationStore } from '@/stores/notification-store';
import { OrderAPI } from '@/lib/api/order';
import { OrderStatus } from '@/lib/data/order';
import { toast } from '@/components/ui/use-toast';
import { useI18n } from '@/lib/i18n/context';

export function useCancelOrder() {
  const { t, locale } = useI18n();
  const { updateOrder, fetchOrderById } = useOrderStore();
  const { createNotification } = useNotificationStore();
  const [isCancelling, setIsCancelling] = useState(false);
  
  const getLocalizedText = (en: string, np: string) => {
    return locale === 'ne' ? np : en;
  };
  
  const cancelOrder = async (orderId: number) => {
    if (isCancelling) return false;
    
    setIsCancelling(true);
    
    try {
      // Show checking toast
      toast({
        title: getLocalizedText('Checking Order Status', 'अर्डर स्थिति जाँच गर्दै'),
        description: getLocalizedText(
          'Verifying if order can be cancelled...',
          'अर्डर रद्द गर्न सकिन्छ कि सकिँदैन जाँच गर्दै...'
        ),
      });

      // Fetch latest order data
      const latestOrder = await OrderAPI.getOrderById(orderId);
      
      // Check if order is still pending
      if (latestOrder.order_status !== OrderStatus.PENDING) {
        const statusMessage = latestOrder.order_status === OrderStatus.ACCEPTED 
          ? getLocalizedText(
              'This order has already been accepted by the professional and cannot be cancelled.',
              'यो अर्डर प्राविधिकद्वारा पहिले नै स्वीकार गरिएको छ र रद्द गर्न सकिँदैन।'
            )
          : getLocalizedText(
              `This order is now ${latestOrder.order_status} and cannot be cancelled.`,
              `यो अर्डर अब ${latestOrder.order_status} भएको छ र रद्द गर्न सकिँदैन।`
            );
        
        toast({
          title: getLocalizedText('Cannot Cancel Order', 'अर्डर रद्द गर्न सकिँदैन'),
          description: statusMessage,
          variant: 'destructive',
        });
        
        // Refresh the order data
        await fetchOrderById(orderId);
        return false;
      }

      // Proceed with cancellation
      toast({
        title: getLocalizedText('Cancelling Order...', 'अर्डर रद्द हुँदै...'),
        description: getLocalizedText(
          'Please wait while we cancel your order.',
          'कृपया अर्डर रद्द हुँदा प्रतीक्षा गर्नुहोस्।'
        ),
      });

      // Update order status to cancelled
      await updateOrder(orderId, { 
        order_status: OrderStatus.CANCELLED 
      });

      // Send notification to professional
      await createNotification({
        user_id: latestOrder.professional_user_id,
        type: 'Order Update',
        title: 'Order Cancelled',
        body: `Order #${orderId} has been cancelled by the customer.`,
        action_route: 'order',
        custom_data: {
          orderId: orderId,
          status: OrderStatus.CANCELLED,
          cancelled_by: 'customer'
        }
      });

      toast({
        title: getLocalizedText('Order Cancelled', 'अर्डर रद्द गरियो'),
        description: getLocalizedText(
          'Your order has been successfully cancelled.',
          'तपाईंको अर्डर सफलतापूर्वक रद्द गरियो।'
        ),
      });

      await fetchOrderById(orderId);
      return true;

    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText(
          'Failed to cancel order. Please try again.',
          'अर्डर रद्द गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।'
        ),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    cancelOrder,
    isCancelling
  };
}