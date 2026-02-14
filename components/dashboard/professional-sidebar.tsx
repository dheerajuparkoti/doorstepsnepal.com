"use client";

import React from "react"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import {
  LayoutDashboard,
  User,
  FileCheck,
  CreditCard,
  ImageIcon,
  Wrench,
  Briefcase,
  ListChecks,
  MapPin,
  Clock,
  CalendarDays,
  CheckCircle,
  Search,
  XCircle,
  Settings,
  Smartphone,
  Shield,
  ChevronDown,
  View,
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

export function ProfessionalSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  // const [openSections, setOpenSections] = useState<string[]>(["profile", "services", "jobs", "settings"]);
  const [openSections, setOpenSections] = useState<string[]>([]);// make labels collapsible


  const navItems: NavItem[] = [
    {
      label: t.professional.sidebar.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t.professional.sidebar.profile,
      href: "/dashboard/profile",
      icon: User,
      children: [
        { label: t.professional.sidebar.viewProfile, href: "/dashboard/profile/view-profile", icon: View},
        { label: t.professional.sidebar.verifyDocuments, href: "/dashboard/profile/verify", icon: FileCheck },
        { label: t.professional.sidebar.paymentsContacts, href: "/dashboard/profile/payments", icon: CreditCard },
        { label: t.professional.sidebar.workGallery, href: "/dashboard/profile/gallery", icon: ImageIcon },
        { label: t.professional.sidebar.mySkills, href: "/dashboard/profile/skills", icon: Wrench },
      ],
    },
    {
      label: t.professional.sidebar.myServices,
      href: "/dashboard/services",
      icon: Briefcase,
      children: [
        { label: t.professional.sidebar.chooseServices, href: "/dashboard/services/choose", icon: ListChecks },
        { label: t.professional.sidebar.serviceArea, href: "/dashboard/services/area", icon: MapPin },
        { label: t.professional.sidebar.serviceTime, href: "/dashboard/services/time", icon: Clock },
      ],
    },
    {
      label: t.professional.sidebar.myJobs,
      href: "/dashboard/jobs",
      icon: CalendarDays,
      children: [
        { label: t.professional.sidebar.pending, href: "/dashboard/jobs/pending", icon: Clock },
        { label: t.professional.sidebar.accepted, href: "/dashboard/jobs/accepted", icon: CheckCircle },
        { label: t.professional.sidebar.inspected, href: "/dashboard/jobs/inspected", icon: Search },
        { label: t.professional.sidebar.completed, href: "/dashboard/jobs/completed", icon: CheckCircle },
        { label: t.professional.sidebar.cancelled, href: "/dashboard/jobs/cancelled", icon: XCircle },
      ],
    },
    {
      label: t.professional.sidebar.payments,
      href: "/dashboard/payments",
      icon: CreditCard,
      children: [
        { label: t.professional.sidebar.myPayments, href: "/dashboard/payments/my-payments", icon: CreditCard },
      ],
    },
    {
      label: t.professional.sidebar.settings,
      href: "/dashboard/settings-privacy",
      icon: Settings,
      children: [
   
        { label: t.professional.sidebar.accountInfo, href: "/dashboard/settings-privacy/account-info", icon: User },
        { label: t.professional.sidebar.appSettings, href: "/dashboard/settings-privacy/app", icon: Smartphone },
        { label: t.professional.sidebar.privacyCenter, href: "/dashboard/settings-privacy/privacy", icon: Shield },
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
