"use client";

import React from "react"

import { AuthProvider } from "@/lib/context/auth-context";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import { ProfessionalSidebar } from "@/components/dashboard/professional-sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { useAuth } from "@/lib/context/auth-context";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { mode } = useAuth();

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
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
