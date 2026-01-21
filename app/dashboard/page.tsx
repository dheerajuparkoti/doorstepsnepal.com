"use client";

import { useUser } from "@/lib/context/user-context";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";

export default function DashboardPage() {
  const { mode } = useUser();

  return mode === "customer" ? <CustomerDashboard /> : <ProfessionalDashboard />;
}
