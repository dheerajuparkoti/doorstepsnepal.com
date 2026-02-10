"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/context/auth-context";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";
import { DashboardSkeleton } from "@/components/dashboard/skeleton/dashboard-skeleton";

function DashboardContent() {
  const { mode, isLoading } = useAuth();

  // Show skeleton while loading auth state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return mode === "customer" ? <CustomerDashboard /> : <ProfessionalDashboard />;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}