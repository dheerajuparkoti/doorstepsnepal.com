// types/notification.ts
export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  action_route?: string;
  custom_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NotificationRequest {
  user_id: number;
  type: string;
  title: string;
  body: string;
  action_route?: string;
  custom_data?: Record<string, any>;
}

export interface NotificationUpdateRequest {
  is_read: boolean;
}

// Helper functions (getNotificationTitle/getNotificationBody)
export const getNotificationTitle = (notification: Notification): string => {
  switch (notification.title) {
    case 'Withdrawal Approved':
      return 'Withdrawal Approved';
    case 'Withdrawal Completed':
      return 'Withdrawal Completed';
    case 'Withdrawal Rejected':
      return 'Withdrawal Rejected';
    case 'Payment Successful':
      return 'Payment Successful';
    case 'Payment Received':
      return 'Payment Received';
    case 'New Service Request Available':
      return 'New Order';
    case 'Inspection Completed':
      return 'Inspection Completed';
    case 'Order Successfully Placed!':
      return 'Order Placed';
    case 'Order Confirmed!':
      return 'Order Confirmed';
    case 'Service Finished!':
      return 'Service Completed';
    case 'Order Expired':
      return 'Order Expired';
    default:
      return notification.title || 'Notification';
  }
};

export const getNotificationBody = (notification: Notification): string => {
  const data = notification.custom_data || {};
  
  switch (notification.title) {
    case 'Withdrawal Approved':
    case 'Withdrawal Completed':
    case 'Withdrawal Rejected':
      const amount = data.amount || 0;
      return `Amount: रू ${amount.toLocaleString()}`;

    case 'Payment Successful':
    case 'Payment Received':
      const paymentAmount = data.amount || 0;
      const orderId = data.orderId || data.order_id;
      return `रू ${paymentAmount.toLocaleString()} for Order #${orderId}`;

    case 'New Service Request Available':
      return 'A new service request is available in your area';

    case 'Order Successfully Placed!':
      return 'Your order has been placed successfully';

    case 'Order Confirmed!':
      return 'Your order has been confirmed';

    case 'Inspection Completed':
      const price = data.total_price || 0;
      return `Total amount: रू ${price.toLocaleString()}`;

    case 'Service Finished!':
      return 'Your service has been completed';

    case 'Order Expired':
      return 'Your order has expired';

    default:
      return notification.body || '';
  }
};

export const getNotificationType = (type: string): string => {
  switch (type) {
    case 'New Order':
      return 'New Order';
    case 'payment_received':
      return 'Payment Received';
    case 'payment_success':
      return 'Payment Success';
    case 'withdrawal_approved':
      return 'Withdrawal Approved';
    case 'withdrawal_completed':
      return 'Withdrawal Completed';
    case 'withdrawal_rejected':
      return 'Withdrawal Rejected';
    default:
      return type || 'Notification';
  }
};

// Group notifications by date (Today, Yesterday, etc.)
export const groupNotificationsByDate = (
  notifications: Notification[],
  isProfessionalMode: boolean
): Map<string, Notification[]> => {
  const filtered = notifications.filter((notif) => {
    if (isProfessionalMode) {
      return ['New Order', 'payment_received', 'withdrawal_approved', 
              'withdrawal_completed', 'withdrawal_rejected'].includes(notif.type);
    }
    return !['New Order', 'payment_received', 'withdrawal_approved', 
             'withdrawal_completed', 'withdrawal_rejected'].includes(notif.type);
  });

  const grouped = new Map<string, Notification[]>();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  filtered.forEach((notif) => {
    const date = new Date(notif.created_at).toDateString();
    let key = date;
    
    if (date === today) key = 'Today';
    else if (date === yesterday) key = 'Yesterday';
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(notif);
  });

  return grouped;
};