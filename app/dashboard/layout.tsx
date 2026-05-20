"use client";

import React, { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/app/notifications/fcm-web";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import { ProfessionalSidebar } from "@/components/dashboard/professional-sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { useAuth } from "@/lib/context/auth-context";
import { useUser } from "@/stores/user-store";
import { RateOrderModal } from "@/components/orders/rate-order-modal";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { mode } = useAuth();
  const user = useUser();
  const [autoRateOrderId, setAutoRateOrderId] = useState<number | null>(null);

  // Listen for foreground FCM messages while the customer is on the dashboard.
  // When the professional marks an order complete, the payload carries
  // action: 'rate_order' — we auto-open the rating modal immediately.
  useEffect(() => {
    if (!messaging || mode !== 'customer') return;
    const unsubscribe = onMessage(messaging, (payload) => {
      const data = payload.data ?? {};
      if (data['action'] === 'rate_order') {
        const raw = data['orderId'] ?? data['order_id'] ?? '';
        const orderId = parseInt(raw, 10);
        if (orderId > 0) setAutoRateOrderId(orderId);
      }
    });
    return () => unsubscribe();
  }, [mode]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <DashboardTopbar />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
          {mode === "customer" ? <CustomerSidebar /> : <ProfessionalSidebar />}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Auto-rate modal triggered by FCM foreground message */}
      {autoRateOrderId != null && user?.id && (
        <RateOrderModal
          orderId={autoRateOrderId}
          customerId={user.id}
          onClose={() => setAutoRateOrderId(null)}
          onRated={() => setAutoRateOrderId(null)}
        />
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
