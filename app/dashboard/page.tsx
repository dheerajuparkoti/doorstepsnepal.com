// "use client";

// import { useUser } from "@/lib/context/user-context";
// import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
// import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";

// export default function DashboardPage() {
//   const { mode } = useUser();

//   return mode === "customer" ? <CustomerDashboard /> : <ProfessionalDashboard />;
// }



// "use client";

// import { ProtectedRoute } from "@/components/auth/protected-route";
// import { useAuth } from "@/lib/context/auth-context";
// import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
// import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";

// function DashboardContent() {
//   const { mode } = useAuth();

//   return mode === "customer" ? <CustomerDashboard /> : <ProfessionalDashboard />;
// }

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <DashboardContent />
//     </ProtectedRoute>
//   );
// }


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