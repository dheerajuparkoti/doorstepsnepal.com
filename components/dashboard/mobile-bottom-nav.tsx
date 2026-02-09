"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/context/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  Briefcase,
} from "lucide-react";

export function MobileBottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { mode } = useAuth();

  const customerNavItems = [
    { label: t.customer.sidebar.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { label: t.customer.sidebar.myBookings, href: "/dashboard/bookings", icon: CalendarDays },
    { label: t.customer.sidebar.favorites, href: "/dashboard/favorites", icon: Heart },
    { label: t.nav.profile, href: "/dashboard/profile", icon: User },
  ];

  const professionalNavItems = [
    { label: t.professional.sidebar.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { label: t.professional.sidebar.myJobs, href: "/dashboard/jobs", icon: CalendarDays },
    { label: t.professional.sidebar.myServices, href: "/dashboard/services", icon: Briefcase },
    { label: t.nav.profile, href: "/dashboard/profile", icon: User },
  ];

  const navItems = mode === "customer" ? customerNavItems : professionalNavItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
