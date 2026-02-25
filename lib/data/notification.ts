import NepaliDate from "nepali-datetime";
import { NepaliDateService } from "../utils/nepaliDate";



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
    case 'Inspection Approved':
        return 'Order Inspection Approved';
    case 'Inspection Rejected':
        return 'Order Inspection Rejected';
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
    case 'Inspection Approved':
    case 'Inspection Rejected':
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



export const groupNotificationsByDate = (
  notifications: Notification[], 
  isProfessionalMode: boolean
): Map<string, Notification[]> => {
  const grouped = new Map<string, Notification[]>();
  

  const filteredNotifications = notifications.filter(notif => {
    const isProNotif = 
      notif.type === 'New Order' ||
      notif.type === 'payment_received' ||
      notif.type === 'withdrawal_approved' ||
      notif.type === 'withdrawal_completed' ||
      notif.type === 'withdrawal_rejected' ||
      (notif.type === 'Order Update' && 
       (notif.title === 'Inspection Approved' || 
        notif.title === 'Inspection Rejected'));
    
    return isProfessionalMode ? isProNotif : !isProNotif;
  });


  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    try {
      const dateA = NepaliDateService.toBS(a.created_at);
      const dateB = NepaliDateService.toBS(b.created_at);
      
      if (!dateA || !dateB) return 0;
      

      const yearA = dateA.getYear();
      const monthA = dateA.getMonth();
      const dayA = dateA.getDate();
      
      const yearB = dateB.getYear();
      const monthB = dateB.getMonth();
      const dayB = dateB.getDate();
      

      if (yearA !== yearB) return yearB - yearA;

      if (monthA !== monthB) return monthB - monthA;

      if (dayA !== dayB) return dayB - dayA;

      const [timeA] = a.created_at.split(' ').slice(1);
      const [timeB] = b.created_at.split(' ').slice(1);
      
      if (timeA && timeB) {
        return timeB.localeCompare(timeA);
      }
      
      return 0;
    } catch (error) {
      console.error('Error sorting notifications:', error);
      return 0;
    }
  });

  // Group by date header
  sortedNotifications.forEach(notification => {
    try {
      const nepaliDate = NepaliDateService.toBS(notification.created_at);
      
      if (!nepaliDate) return;
      
      // Get today and yesterday in BS
      const now = NepaliDateService.now();
      const yesterday = new NepaliDate(
        now.getYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      
      let header = '';
      
      // Check if it's today
      if (nepaliDate.getYear() === now.getYear() &&
          nepaliDate.getMonth() === now.getMonth() &&
          nepaliDate.getDate() === now.getDate()) {
        header = 'Today';
      } 
      // Check if it's yesterday
      else if (nepaliDate.getYear() === yesterday.getYear() &&
               nepaliDate.getMonth() === yesterday.getMonth() &&
               nepaliDate.getDate() === yesterday.getDate()) {
        header = 'Yesterday';
      } 
      // For other dates, use formatted Nepali date
      else {
        header = NepaliDateService.formatHeader(nepaliDate); // This will give "Mangsir 1, 2082"
      }
      
      if (!grouped.has(header)) {
        grouped.set(header, []);
      }
      grouped.get(header)?.push(notification);
    } catch (error) {
      console.error('Error grouping notification:', error);
    }
  });

  return grouped;
};