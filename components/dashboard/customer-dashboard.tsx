"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/context/auth-context";
import { useOrderStore } from "@/stores/order-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  CalendarDays,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Package,
  Banknote,
  TrendingUp,
  LayoutGrid,
  Sparkles,
  Users,
  MapPin,
  Bell,
  Home,
  Briefcase,
} from "lucide-react";
import { CustomerAddress, OrderStatus } from "@/lib/data/order";

import { FeaturedServicesSkeleton } from "../home/skeleton/feateured-services-skeleton";
import dynamic from 'next/dynamic';
import { ProfessionalsSkeleton } from "../home/skeleton/professional-skeleton";
import { SearchSkeleton } from "../home/skeleton/search-skeleton";
import React from "react";

const FeaturedServicesWrapper = dynamic(
  () => import('@/components/dashboard/customer/featured-services-wrapper'),
  {
    ssr: true,
    loading: () => <FeaturedServicesSkeleton />
  }
);

const ProfessionalsWrapper = dynamic(
  () => import('@/components/dashboard/customer/professional-wrapper'),
  {
    ssr: true,
    loading: () => <ProfessionalsSkeleton />
  }
);

const SearchWrapper = dynamic(
  () => import('@/components/dashboard/customer/search-wrapper'),
  {
    ssr: true,
    loading: () => <SearchSkeleton />
  }
);

// Status configuration for bookings - with lighter colors
const statusConfig: Record<string, { 
  label: string; 
  labelNe: string; 
  icon: any;
  bgColor: string;
  lightBg: string;
  borderColor: string;
  textColor: string;
  href: string;
}> = {
  pending: { 
    label: "Pending", 
    labelNe: "पेन्डिङ", 
    icon: Clock,
    bgColor: "bg-amber-400",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-100",
    textColor: "text-amber-600",
    href: "/dashboard/customer/bookings/pending"
  },
  accepted: { 
    label: "Accepted", 
    labelNe: "स्वीकृत", 
    icon: CheckCircle,
    bgColor: "bg-blue-400",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-100",
    textColor: "text-blue-600",
    href: "/dashboard/customer/bookings/accepted"
  },
  inspected: { 
    label: "Inspected", 
    labelNe: "निरीक्षण", 
    icon: Eye,
    bgColor: "bg-purple-400",
    lightBg: "bg-purple-50",
    borderColor: "border-purple-100",
    textColor: "text-purple-600",
    href: "/dashboard/customer/bookings/awaiting-approval"
  },
  ongoing: { 
    label: "Ongoing", 
    labelNe: "जारी", 
    icon: Briefcase,
    bgColor: "bg-indigo-400",
    lightBg: "bg-indigo-50",
    borderColor: "border-indigo-100",
    textColor: "text-indigo-600",
    href: "/dashboard/customer/bookings/ongoing"
  },
  completed: { 
    label: "Completed", 
    labelNe: "पूरा भयो", 
    icon: CheckCircle,
    bgColor: "bg-emerald-400",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-600",
    href: "/dashboard/customer/bookings/completed"
  },
  cancelled: { 
    label: "Cancelled", 
    labelNe: "रद्द", 
    icon: XCircle,
    bgColor: "bg-rose-400",
    lightBg: "bg-rose-50",
    borderColor: "border-rose-100",
    textColor: "text-rose-600",
    href: "/dashboard/customer/bookings/cancelled"
  },
};

export function CustomerDashboard() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  
  const { 
    orders, 
    isLoading: ordersLoading, 
    fetchCustomerOrders 
  } = useOrderStore();

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id);
    }
  }, [user?.id, fetchCustomerOrders]);

  // Filter orders by status
  const pendingBookings = orders.filter(order => order.order_status === OrderStatus.PENDING);
  const acceptedBookings = orders.filter(order => order.order_status === OrderStatus.ACCEPTED);
  const inspectedBookings = orders.filter(order => order.order_status === OrderStatus.INSPECTED);
  const completedBookings = orders.filter(order => order.order_status === OrderStatus.COMPLETED);
  const cancelledBookings = orders.filter(order => order.order_status === OrderStatus.CANCELLED);

  const totalSpent = user?.total_spent ?? 0;

  // Status cards data
  const statusCards = [
    { key: 'pending', count: pendingBookings.length, ...statusConfig.pending },
    { key: 'accepted', count: acceptedBookings.length, ...statusConfig.accepted },
    { key: 'inspected', count: inspectedBookings.length, ...statusConfig.inspected },
    { key: 'completed', count: completedBookings.length, ...statusConfig.completed },
    { key: 'cancelled', count: cancelledBookings.length, ...statusConfig.cancelled },
  ];

  // Stats for the dashboard
  const stats = [
    {
      label: getLocalizedText('Total Bookings', 'कुल बुकिंग'),
      value: orders.length.toString(),
      icon: LayoutGrid,
      change: getLocalizedText(`+${completedBookings.length} completed`, `+${completedBookings.length} पूरा`),
      trend: "positive" as const,
      lightBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: getLocalizedText('Active Bookings', 'सक्रिय बुकिंग'),
      value: (pendingBookings.length + acceptedBookings.length + inspectedBookings.length ).toString(),
      icon: Briefcase,
      change: getLocalizedText(`${acceptedBookings.length} accepted`, `${acceptedBookings.length} स्वीकृत`),
      trend: "neutral" as const,
      lightBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: getLocalizedText('Total Spent', 'कुल खर्च'),
      value: `रू ${totalSpent.toLocaleString()}`,
      icon: Banknote,
      change: getLocalizedText(
        `avg. रू ${completedBookings.length ? (totalSpent / completedBookings.length).toFixed(0) : 0}`,
        `औसत रू ${completedBookings.length ? (totalSpent / completedBookings.length).toFixed(0) : 0}`
      ),
      trend: "neutral" as const,
      lightBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: getLocalizedText('Success Rate', 'सफलता दर'),
      value: orders.length ? `${Math.round((completedBookings.length / orders.length) * 100)}%` : '0%',
      icon: TrendingUp,
      change: getLocalizedText(`${completedBookings.length} completed`, `${completedBookings.length} पूरा`),
      trend: "positive" as const,
      lightBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section - Without Avatar */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-primary/60 to-primary rounded-full"></div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {getLocalizedText('Hi', 'नमस्ते')}, {language === "ne" ? user?.nameNe || user?.name : user?.name}!
            </h1>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
                   <p className="mt-1 text-muted-foreground">
           {language === 'ne' 
              ? 'तपाईंको बुकिंग र सेवाहरू यहाँ व्यवस्थापन गर्नुहोस्'
              : t.customer.welcome.subtitle
            }
          </p>
        
          </div>
      
        </div>
        <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90">
          <Link href="/services">
            <Plus className="mr-2 h-5 w-5" />
            {getLocalizedText('Book New Service', 'नयाँ सेवा बुक गर्नुहोस्')}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      {!ordersLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    {stat.trend === "positive" && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{stat.change}</span>
                      </div>
                    )}
                    {stat.trend === "neutral" && (
                      <span className="text-sm text-muted-foreground">{stat.change}</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Status Cards Grid */}
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="h-5 w-1 bg-primary/40 rounded-full"></div>
            {getLocalizedText('Your Booking Status', 'तपाईंको बुकिंग स्थिति')}
          </h2>
          <Link 
            href="/dashboard/bookings" 
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group"
          >
            {getLocalizedText('View all', 'सबै हेर्नुहोस्')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statusCards.map((status) => {
            const Icon = status.icon;
            const hasBookings = status.count > 0;
            
            return (
              <Link key={status.key} href={status.href} className="block">
                <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${status.lightBg} ${status.textColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {hasBookings && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            {status.count} {getLocalizedText(
                              status.count === 1 ? 'booking' : 'bookings',
                              status.count === 1 ? 'बुकिंग' : 'बुकिंगहरू'
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold">{status.count}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {language === 'ne' ? status.labelNe : status.label}
                        </p>
                        {hasBookings && (
                          <ArrowRight className={`h-4 w-4 ${status.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Preview (if there are bookings) */}
      {!ordersLoading && orders.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-4 w-1 bg-primary/40 rounded-full"></div>
                {getLocalizedText('Recent Activity', 'हालैका गतिविधिहरू')}
              </h3>
         
            </div>
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => {
                const StatusIcon = statusConfig[order.order_status.toLowerCase()]?.icon || Package;
                const statusInfo = statusConfig[order.order_status.toLowerCase()];
                const PaymentIcon = order.payment_status === 'paid' ? CheckCircle : Clock;
                const paymentStatusColor = order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600';
                
                return (
                  <Link 
                    key={order.id} 
                    href={`/dashboard/customer/bookings/booking-details/${order.id}`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-10 w-10 rounded-lg ${statusInfo?.lightBg || 'bg-muted'} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`h-5 w-5 ${statusInfo?.textColor || 'text-muted-foreground'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {language === 'ne' ? order.service_name_np : order.service_name_en}
                          </p>
                          <Badge variant="secondary" className={`${statusInfo?.lightBg} ${statusInfo?.textColor} border-0 text-xs flex-shrink-0`}>
                            {language === 'ne' ? statusInfo?.labelNe : statusInfo?.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                          {/* Professional Info */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Briefcase className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{order.professional_name}</span>
                          </div>
                          
                          {/* Date & Time */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {order.scheduled_date 
                                ? new Date(order.scheduled_date).toLocaleDateString() 
                                : new Date(order.order_date).toLocaleDateString()}
                              {order.scheduled_time && ` • ${order.scheduled_time}`}
                            </span>
                          </div>
                          
                          {/* Quantity */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Package className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {getLocalizedText('Qty', 'मात्रा')}-{order.quantity} | {order.price_unit_name || getLocalizedText('units', 'एकाइ')} | {order.quality_type_name}
                            </span>
                          </div>
                          
                          {/* Payment Status */}
                          <div className="flex items-center gap-1 text-xs">
                            <PaymentIcon className={`h-3 w-3 flex-shrink-0 ${paymentStatusColor}`} />
                            <span className={`truncate capitalize ${paymentStatusColor}`}>
                              {order.payment_status === 'paid' 
                                ? getLocalizedText('paid', 'भुक्तानी भयो')
                                : order.payment_status === 'partial'
                                ? getLocalizedText('partial', 'आंशिक')
                                : getLocalizedText('unpaid', 'बाँकी')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Total Price */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed">
                          <span className="text-xs text-muted-foreground">
                            {getLocalizedText('Total:', 'कुल:')}
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            रू {order.total_price?.toLocaleString()}
                          </span>
                          {order.total_paid_amount > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (रू {order.total_paid_amount.toLocaleString()} {getLocalizedText('paid', 'भुक्तानी')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
  
      {/* Search Section */}
      <div className="pt-10">
        <SearchWrapper />
      </div>

      {/* Featured Services */}
      <div className="space-y-4">
        
        <FeaturedServicesWrapper />
      </div>

      {/* Professionals Section */}
      <div className="space-y-4">
      
        <ProfessionalsWrapper />
      </div>
    </div>
  );
}