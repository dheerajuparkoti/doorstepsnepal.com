'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Eye,
  DollarSign,
  User,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const paymentStatusConfig = {
  [PaymentStatus.UNPAID]: {
    label: "Unpaid",
    labelNp: "भुक्तानी बाँकी",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  [PaymentStatus.PARTIAL]: {
    label: "Partial",
    labelNp: "आंशिक भुक्तानी",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  [PaymentStatus.PAID]: {
    label: "Paid",
    labelNp: "भुक्तानी भयो",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
};

export default function InspectedBookingsPage() {
  const { t, locale } = useI18n();
  const {
    orders,
    isLoading,
    error,
    fetchCustomerOrders,
  } = useOrderStore();

  const mockCustomerId = 49;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      await fetchCustomerOrders(mockCustomerId);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    loadOrders();
  };

  // Filter only inspected orders
  const inspectedOrders = orders.filter(order => order.order_status === OrderStatus.INSPECTED);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Inspected Bookings</h1>
          <p className="text-muted-foreground">Bookings after site inspection</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Bookings</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inspected Bookings</h1>
            <p className="text-muted-foreground">Bookings after site inspection</p>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {inspectedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-purple-50">
              <Eye className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Inspected Bookings</h3>
            <p className="text-muted-foreground mb-6">
              You have no inspected bookings at the moment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inspectedOrders.map((order) => {
            const paymentStatus = order.payment_status as PaymentStatus;
            const paymentInfo = paymentStatusConfig[paymentStatus];
            const remainingAmount = order.payment_summary.remaining_amount;
            const isPaymentPending = paymentStatus !== PaymentStatus.PAID;

            return (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Booking Info */}
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0 bg-purple-50">
                          <div className="w-full h-full flex items-center justify-center">
                            <Eye className="w-8 h-8 text-purple-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {locale === 'ne' ? order.service_name_np : order.service_name_en}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Professional: {order.professional_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                <Eye className="w-3 h-3 mr-1" />
                                Inspected
                              </Badge>
                              <Badge className={paymentInfo.color}>
                                {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-3 text-sm mt-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.scheduled_date)}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="font-medium">Final Price:</span>
                              <span className="text-primary font-bold">Rs. {order.total_price}</span>
                            </div>
                          </div>

                          {/* Inspection Notes */}
                          {order.inspection_notes && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                    Inspection Notes
                                  </p>
                                  <p className="text-sm text-blue-600 dark:text-blue-400">
                                    {order.inspection_notes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Order ID: #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Inspected on {formatDate(order.order_date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">Rs. {order.total_price}</p>
                          {remainingAmount > 0 && (
                            <p className="text-sm text-orange-600">
                              Balance: Rs. {remainingAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-purple-50/30 dark:bg-purple-950/10 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Service Details
                          </p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Quantity:</span>
                              <span className="font-medium">{order.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Quality:</span>
                              <span className="font-medium">{order.quality_type_id}</span>
                            </div>
                          </div>
                        </div>

                        {isPaymentPending && (
                          <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              Payment Required Before Service
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => window.location.href = `/orders/${order.id}`}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => window.open(`tel:${order.customer_phone}`)}
                        >
                          <Phone className="w-4 h-4" />
                          Call Professional
                        </Button>

                        {isPaymentPending && (
                          <Button
                            size="sm"
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => window.location.href = `/payment/${order.id}`}
                          >
                            <DollarSign className="w-4 h-4" />
                            Make Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}