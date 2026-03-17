"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/context/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  Briefcase,
  CreditCard,
  Settings,
  Clock,
  CheckCircle,
  Search,
  XCircle,
  FileCheck,
  ImageIcon,
  Wrench,
  ListChecks,
  MapPin,
  View,
  ChevronUp,
  AwardIcon,
  BriefcaseBusiness,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStateStore } from "@/stores/app-state-store";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

export function MobileBottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useAuth();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);
 
const professionalId = useAppStateStore((state) => state.professionalId);
  // Close sheet when route changes
  useEffect(() => {
    setOpenMenu(null);
    setOpenSections([]);
  }, [pathname]);

  // Customer menu structure
  const customerMenuItems: MenuItem[] = [
    { 
      label: t.customer.sidebar.dashboard, 
      href: "/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      label: t.customer.sidebar.myBookings, 
      href: "/dashboard/bookings", 
      icon: CalendarDays,
      children: [
        { label: t.customer.sidebar.pending, href: "/dashboard/customer/bookings/pending", icon: Clock },
        { label: t.customer.sidebar.accepted, href: "/dashboard/customer/bookings/accepted", icon: CheckCircle },
        { label: t.customer.sidebar.awaitingApproval, href: "/dashboard/customer/bookings/awaiting-approval", icon: Search },
        { label: t.customer.sidebar.completed, href: "/dashboard/customer/bookings/completed", icon: CheckCircle },
        { label: t.customer.sidebar.cancelled, href: "/dashboard/customer/bookings/cancelled", icon: XCircle },
      ],
    },
    { 
      label: t.customer.sidebar.favorites, 
      href: "/dashboard/favorites/my-favorites", 
      icon: Heart,
      children: [
        { label: t.customer.sidebar.myFavorites, href: "/dashboard/favorites/my-favorites", icon: Heart },
      ],
    },
    { 
      label: t.nav.profile, 
      href: "/dashboard/profile/customer", 
      icon: User 
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
      label: t.customer.sidebar.settings, 
      href: "/dashboard/settings-privacy", 
      icon: Settings,
      children: [
        { label: t.customer.sidebar.accountInfo, href: "/dashboard/settings-privacy/account-info", icon: User },
      ],
    },
  ];

  // Professional menu structure
  const professionalMenuItems: MenuItem[] = [
    { 
      label: t.professional.sidebar.dashboard, 
      href: "/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      label: t.professional.sidebar.profile, 
      href: "/dashboard/profile", 
      icon: User,
      children: [
        
       { label: t.professional.sidebar.viewProfile,  href: `/dashboard/profile/professional/${professionalId}`,
                 icon: View},
        { label: t.professional.sidebar.verifyDocuments, href: "/dashboard/professional/verify-documents", icon: FileCheck },
        { label: t.professional.sidebar.paymentsContacts, href: "/dashboard/professional/payments", icon: CreditCard },
        { label: t.professional.sidebar.workGallery, href: "/dashboard/professional/gallery", icon: ImageIcon },
        { label: t.professional.sidebar.mySkills, href: "/dashboard/professional/skills", icon: Wrench },
      ],
    },
    { 
      label: t.professional.sidebar.myServices, 
      href: "/dashboard/services", 
      icon: Briefcase,
      children: [
        { label: t.professional.sidebar.chooseServices, href: "/dashboard/professional/own-services", icon: ListChecks },
        { label: t.professional.sidebar.serviceArea, href: "/dashboard/professional/service-area", icon: MapPin },
        { label: t.professional.sidebar.serviceTime, href: "/dashboard/professional/service-availability", icon: Clock },
      ],
    },
    { 
      label: t.professional.sidebar.myJobs, 
      href: "/dashboard/jobs", 
      icon: CalendarDays,
      children: [
        { label: t.professional.sidebar.pending, href: "/dashboard/professional/jobs/pending", icon: Clock },
        { label: t.professional.sidebar.accepted, href: "/dashboard/professional/jobs/accepted", icon: CheckCircle },
        { label: t.professional.sidebar.awaitingApproval, href: "/dashboard/professional/jobs/awaiting-approval", icon: Search },
        { label: t.professional.sidebar.completed, href: "/dashboard/professional/jobs/completed", icon: CheckCircle },
        { label: t.professional.sidebar.cancelled, href: "/dashboard/professional/jobs/cancelled", icon: XCircle },
      ],
    },
    { 
      label: t.professional.sidebar.payments, 
      href: "/dashboard/payments", 
      icon: CreditCard,
      children: [
        { label: t.professional.sidebar.myPayments, href: "/dashboard/payments/my-payments", icon: CreditCard },
                           { label: t.professional.sidebar.partnerBenefitProgram, href: "/dashboard/professional/partner-benefit-program", icon:  AwardIcon},

      ],
    },
    { 
      label: t.professional.sidebar.settings, 
      href: "/dashboard/settings-privacy", 
      icon: Settings,
      children: [
        { label: t.professional.sidebar.accountInfo, href: "/dashboard/settings-privacy/account-info", icon: User },           { label: t.professional.sidebar.privacyPolicyProfessional, href: "/dashboard/settings-privacy/privacy-policy", icon: BriefcaseBusiness },
           { label: t.professional.sidebar.privacyPolicyProfessional, href: "/dashboard/settings-privacy/privacy-policy", icon: BriefcaseBusiness },

      ],
    },
  ];

  const menuItems = mode === "customer" ? customerMenuItems : professionalMenuItems;

  // Get main nav items (first 4 for bottom bar)
  const mainNavItems = menuItems.slice(0, 4);
  const moreMenuItems = menuItems.slice(4);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // If it has children, open the sheet instead of navigating
      setOpenMenu(item.href);
    } else {
      // If no children, navigate
      router.push(item.href);
      setOpenMenu(null);
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const sectionKey = item.href.split("/").pop() || "";
    const isOpen = openSections.includes(sectionKey);

    if (hasChildren) {
      return (
        <Collapsible
          key={item.href}
          open={isOpen}
          onOpenChange={() => toggleSection(sectionKey)}
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
              <ChevronUp
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className={cn("space-y-1", depth === 0 ? "ml-4 pl-4 border-l border-border" : "ml-6")}>
            {item.children?.map((child) => renderMenuItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <button
        key={item.href}
        onClick={() => {
          router.push(item.href);
          setOpenMenu(null);
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors text-left",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="flex items-center justify-around">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <button
                key={item.href}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* More Menu Button */}
          {moreMenuItems.length > 0 && (
            <Sheet open={openMenu === "more"} onOpenChange={(open) => setOpenMenu(open ? "more" : null)}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                    openMenu === "more"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <div className="flex space-x-0.5">
                      <div className="h-1 w-1 rounded-full bg-current"></div>
                      <div className="h-1 w-1 rounded-full bg-current"></div>
                      <div className="h-1 w-1 rounded-full bg-current"></div>
                    </div>
                  </div>
                  <span>More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full pb-8">
                  <div className="p-4 space-y-1">
                    {moreMenuItems.map((item) => renderMenuItem(item))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>

      {/* Individual Menu Sheets for each main item with children */}
      {mainNavItems.map((item) => {
        if (!item.children || item.children.length === 0) return null;
        
        return (
          <Sheet key={`sheet-${item.href}`} open={openMenu === item.href} onOpenChange={(open) => setOpenMenu(open ? item.href : null)}>
            <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>{item.label}</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full pb-8">
                <div className="p-4 space-y-1">
                  {item.children.map((child) => renderMenuItem(child))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        );
      })}
    </>
  );
}