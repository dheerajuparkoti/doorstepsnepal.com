"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/context/auth-context";
import { useOrderStore } from "@/stores/order-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  CalendarDays,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Package,
  Percent,
  Star,
  MapPin,
  User,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { OrderStatus } from "@/lib/data/order";


import { FeaturedServicesSkeleton } from "../home/skeleton/feateured-services-skeleton";

import dynamic from 'next/dynamic';
import { ProfessionalsSkeleton } from "../home/skeleton/professional-skeleton";
import { SearchSkeleton } from "../home/skeleton/search-skeleton";

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
// Status configuration for bookings
const statusConfig: Record<string, { 
  label: string; 
  labelNe: string; 
  className: string;
  icon: any;
}> = {
  pending: { 
    label: "Pending", 
    labelNe: "पेन्डिङ", 
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    icon: Clock
  },
  accepted: { 
    label: "Accepted", 
    labelNe: "स्वीकृत", 
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    icon: CheckCircle
  },
  inspected: { 
    label: "Inspected", 
    labelNe: "निरीक्षण गरियो", 
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500",
    icon: Eye
  },
  ongoing: { 
    label: "Ongoing", 
    labelNe: "जारी", 
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    icon: Package
  },
  completed: { 
    label: "Completed", 
    labelNe: "पूरा भयो", 
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    icon: CheckCircle
  },
  cancelled: { 
    label: "Cancelled", 
    labelNe: "रद्द गरियो", 
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    icon: XCircle
  },
};


export function CustomerDashboard() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  
  // Get orders from store
  const { 
    orders, 
    isLoading: ordersLoading, 
    fetchCustomerOrders 
  } = useOrderStore();

  // Fetch orders on mount
  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id);
    }
  }, [user?.id, fetchCustomerOrders]);

  // Filter orders by status for quick stats
  const pendingBookings = orders.filter(order => order.order_status === OrderStatus.PENDING);
  const acceptedBookings = orders.filter(order => order.order_status === OrderStatus.ACCEPTED);
  const inspectedBookings = orders.filter(order => order.order_status === OrderStatus.INSPECTED);
  // const ongoingBookings = orders.filter(order => order.order_status === OrderStatus.ONGOING);
  const completedBookings = orders.filter(order => order.order_status === OrderStatus.COMPLETED);
  const cancelledBookings = orders.filter(order => order.order_status === OrderStatus.CANCELLED);

  // Get recent bookings (last 3)
  const recentBookings = [...orders]
    .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    .slice(0, 3);

  // Calculate total spent
  const totalSpent = completedBookings.reduce((sum, order) => sum + order.total_price, 0);

  // Stats for the dashboard
  const stats = [
    {
      label: language === 'ne' ? 'कुल बुकिंग' : 'Total Bookings',
      value: orders.length.toString(),
      icon: Package,
      change: `+${completedBookings.length} completed`,
      changeType: "positive" as const,
    },
    {
      label: language === 'ne' ? 'बाँकी बुकिंग' : 'Pending',
      value: pendingBookings.length.toString(),
      icon: Clock,
      change: `${acceptedBookings.length} accepted`,
      changeType: "neutral" as const,
    },
    {
      label: language === 'ne' ? 'कुल खर्च' : 'Total Spent',
      value: `Rs. ${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      change: `avg. Rs. ${completedBookings.length ? (totalSpent / completedBookings.length).toFixed(0) : 0}`,
      changeType: "neutral" as const,
    },
    // {
    //   label: language === 'ne' ? 'सक्रिय बुकिंग' : 'Active',
    //   value: (acceptedBookings.length + ongoingBookings.length).toString(),
    //   icon: TrendingUp,
    //   change: `${inspectedBookings.length} inspected`,
    //   changeType: "positive" as const,
    // },
  ];

  return (
    <div className="space-y-6">


      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t.dashboard.hi}, {language === "ne" ? user?.nameNe || user?.name : user?.name}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {language === 'ne' 
              ? 'तपाईंको बुकिंग र सेवाहरू यहाँ व्यवस्थापन गर्नुहोस्'
              : t.customer.welcome.subtitle
            }
          </p>
        </div>
        <Button asChild>
          <Link href="/services">
            <Plus className="mr-2 h-4 w-4" />
            {language === 'ne' ? 'नयाँ सेवा बुक गर्नुहोस्' : t.customer.quickActions.bookService}
          </Link>
        </Button>
      </div>


{/* Search Section */}
<div className="pt-18">
  <SearchWrapper />
</div>


      {/* Stats Grid */}
      {!ordersLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    {stat.changeType === "positive" && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        {stat.change}
                      </div>
                    )}
                    {stat.changeType === "neutral" && (
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

 

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/services">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {language === 'ne' ? 'सेवा बुक गर्नुहोस्' : t.customer.quickActions.bookService}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ne" ? "नयाँ सेवा बुक गर्नुहोस्" : "Book a new service"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/services">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {language === 'ne' ? 'सेवाहरू खोज्नुहोस्' : t.customer.quickActions.browseServices}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ne" ? "सबै सेवाहरू हेर्नुहोस्" : "Explore all services"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/dashboard/bookings">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {language === 'ne' ? 'मेरो बुकिंगहरू' : t.customer.quickActions.viewActiveBookings}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ne" ? "तपाईंको बुकिङहरू हेर्नुहोस्" : "View your bookings"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Booking Status Summary */}
      {!ordersLoading && orders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/bookings/pending">
            <Badge variant="outline" className="cursor-pointer hover:bg-yellow-50 px-3 py-1">
              <Clock className="w-3 h-3 mr-1" />
              {language === 'ne' ? 'बाँकी' : 'Pending'}: {pendingBookings.length}
            </Badge>
          </Link>
          <Link href="/dashboard/bookings/accepted">
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 px-3 py-1">
              <CheckCircle className="w-3 h-3 mr-1" />
              {language === 'ne' ? 'स्वीकृत' : 'Accepted'}: {acceptedBookings.length}
            </Badge>
          </Link>
          <Link href="/dashboard/bookings/inspected">
            <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 px-3 py-1">
              <Eye className="w-3 h-3 mr-1" />
              {language === 'ne' ? 'निरीक्षण' : 'Inspected'}: {inspectedBookings.length}
            </Badge>
          </Link>
          <Link href="/dashboard/bookings/completed">
            <Badge variant="outline" className="cursor-pointer hover:bg-green-50 px-3 py-1">
              <CheckCircle className="w-3 h-3 mr-1" />
              {language === 'ne' ? 'सम्पन्न' : 'Completed'}: {completedBookings.length}
            </Badge>
          </Link>
          <Link href="/dashboard/bookings/cancelled">
            <Badge variant="outline" className="cursor-pointer hover:bg-red-50 px-3 py-1">
              <XCircle className="w-3 h-3 mr-1" />
              {language === 'ne' ? 'रद्द' : 'Cancelled'}: {cancelledBookings.length}
            </Badge>
          </Link>
        </div>
      )}

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {language === 'ne' ? 'हालैका बुकिंगहरू' : 'Recent Bookings'}
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              {t.common.seeAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => {
                const status = statusConfig[booking.order_status.toLowerCase()] || statusConfig.pending;
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/orders/${booking.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={booking.professional_name || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {booking.professional_name?.[0] || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {language === "ne" ? booking.service_name_np : booking.service_name_en}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.professional_name || 'Professional'}
                          </p>
                        </div>
                      </div>
                      <Badge className={status.className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {language === "ne" ? status.labelNe : status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {booking.scheduled_date && (
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(booking.scheduled_date).toLocaleDateString()}
                        </div>
                      )}
                      {booking.customer_address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.customer_address.municipality || 'Location'}
                        </div>
                      )}
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        Rs. {booking.total_price}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>{language === 'ne' ? 'कुनै बुकिंगहरू छैनन्' : 'No bookings yet'}</p>
              <Button className="mt-4" asChild>
                <Link href="/services">
                  {language === 'ne' ? 'सेवा बुक गर्नुहोस्' : 'Book a Service'}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>


{/* Featured Services */}

<FeaturedServicesWrapper />

      {/* Professionals Section */}
      <ProfessionalsWrapper />

    </div>
  );
}

