"use client";

import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/app/notifications/fcm-web";
import { usePaymentStore } from "@/stores/professional/payment-store";
import { useWalletStore } from "@/stores/professional/wallet-store";
import { showPaymentSuccessToast, showWalletUpdateToast } from "@/components/notifications/payment-toast";
import { AnnouncementDialog } from "@/components/notifications/announcement-dialog";

export function useFCMHandler() {
  const [announcement, setAnnouncement] = useState<{
    open: boolean;
    type?: string;
    title: string;
    message: string;
    imageUrl?: string;
    linkUrl?: string;
  }>({
    open: false,
    title: "",
    message: ""
  });


  const refreshPayments = usePaymentStore((state) => state.refreshAfterPayment);
  const refreshWallet = useWalletStore((state) => state.refreshWalletData);

  useEffect(() => {
    if (!messaging) return;

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, async (payload) => {
      console.log("📨 Foreground notification:", payload);
      
      const data = payload.data || {};
      const notification = payload.notification;
      
      // Extract data (handles both data and notification payloads)
      const title = data.title || notification?.title || "";
      const body = data.body || notification?.body || "";
      const type = data.type || data.notification_type || "";
      const orderId = data.orderId || data.order_id;
      const amount = data.amount ? parseFloat(data.amount) : 0;
      const professionalId = data.professionalId || data.professional_id;
      const imageUrl = data.image_url || data.image;
      const linkUrl = data.link_url || data.link;

      // Handle by type (matches mobile behavior)
      if (title.includes('Payment Successful') || type === 'payment_success' || data.payment_success) {
        // Refresh payment data
        if (orderId) {
          await refreshPayments(parseInt(orderId));
        }
        
        // Show toast
        showPaymentSuccessToast({
          orderId: parseInt(orderId),
          amount,
          professionalId: professionalId ? parseInt(professionalId) : undefined
        });
      }
      
      // Handle wallet/commission notifications
      else if (
        type.includes('wallet') || 
        type.includes('commission') || 
        type.includes('withdrawal') ||
        title.includes('Wallet') ||
        title.includes('Commission')
      ) {
        // Refresh wallet data
        if (professionalId) {
          await refreshWallet(parseInt(professionalId));
        }
        
        // Show wallet toast
        showWalletUpdateToast({
          amount,
          type: type.includes('commission') ? 'commission' : 
                type.includes('withdrawal') ? 'withdrawal' : 'credit',
          orderId: orderId ? parseInt(orderId) : undefined
        });
      }
      
      // Handle announcements
      else if (
        type === 'festival' || 
        type === 'offer' || 
        type === 'maintenance' || 
        type === 'update' || 
        type === 'alert' ||
        data.announcement
      ) {
        setAnnouncement({
          open: true,
          type,
          title,
          message: body,
          imageUrl,
          linkUrl
        });
      }
      
      // Default notification
      else {
        // Show as toast or dialog based on content
        if (imageUrl) {
          setAnnouncement({
            open: true,
            type: 'announcement',
            title,
            message: body,
            imageUrl,
            linkUrl
          });
        } else {
          // Default browser notification for others
          if (Notification.permission === 'granted') {
            new Notification(title, {
              body,
              icon: '/icon-192x192.png',
              data: { url: linkUrl || '/' }
            });
          }
        }
      }
    });

    // Also listen for messages from service worker (when app was in background)
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FCM_MESSAGE') {
        const { title, body, data } = event.data.payload;
        console.log("📨 Message from SW:", { title, body, data });
        
        // Handle the same way as foreground
        if (data?.payment_success) {
          // ... same logic as above
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSWMessage);

    return () => {
      unsubscribe();
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    };
  }, [refreshPayments, refreshWallet]);

  return {
    announcement,
    setAnnouncement
  };
}