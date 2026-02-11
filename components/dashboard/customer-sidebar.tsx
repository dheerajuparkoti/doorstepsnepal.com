"use client";

import React from "react"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  CheckCircle,
  Search,
  XCircle,
  CreditCard,
  Heart,
  Users,
  Settings,
  User,
  Smartphone,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

export function CustomerSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(["bookings", "favorites", "settings"]);

  const navItems: NavItem[] = [
    {
      label: t.customer.sidebar.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t.customer.sidebar.myBookings,
      href: "/dashboard/bookings",
      icon: CalendarDays,
      children: [
        { label: t.customer.sidebar.pending, href: "/dashboard/bookings/pending", icon: Clock },
        { label: t.customer.sidebar.accepted, href: "/dashboard/bookings/accepted", icon: CheckCircle },
        { label: t.customer.sidebar.inspected, href: "/dashboard/bookings/inspected", icon: Search },
        { label: t.customer.sidebar.completed, href: "/dashboard/bookings/completed", icon: CheckCircle },
        { label: t.customer.sidebar.cancelled, href: "/dashboard/bookings/cancelled", icon: XCircle },
      ],
    },
    {
      label: t.customer.sidebar.payments,
      href: "/dashboard/payments",
      icon: CreditCard,
      children: [
        { label: t.customer.sidebar.myPayments, href: "/dashboard/payments/my-payments", icon: CreditCard },
      ],
    },
    {
      label: t.customer.sidebar.favorites,
      href: "/dashboard/favorites",
      icon: Heart,
      children: [
        { label: t.customer.sidebar.myFavorites, href: "/dashboard/favorites/my-favorites", icon: Heart },
        // { label: t.customer.sidebar.favProfessionals, href: "/dashboard/favorites/professionals", icon: Users },
      ],
    },
    {
      label: t.customer.sidebar.settings,
      href: "/dashboard/settings-privacy",
      icon: Settings,
      children: [
        { label: t.customer.sidebar.accountInfo, href: "/dashboard/settings-privacy/account-info", icon: User },
        { label: t.customer.sidebar.appSettings, href: "/dashboard/settings-privacy/app", icon: Smartphone },
        { label: t.customer.sidebar.privacyCenter, href: "/dashboard/settings-privacy/privacy", icon: Shield },
      ],
    },
  ];

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <nav className="flex h-full flex-col overflow-y-auto p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const hasChildren = item.children && item.children.length > 0;
          const sectionKey = item.href.split("/").pop() || "";
          const isOpen = openSections.includes(sectionKey);

          if (hasChildren) {
            return (
              <Collapsible
                key={item.href}
                open={isOpen}
                onOpenChange={() => toggleSection(sectionKey)}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                  {item.children?.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isChildActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <ChildIcon className="h-4 w-4" />
                        {child.label}
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
