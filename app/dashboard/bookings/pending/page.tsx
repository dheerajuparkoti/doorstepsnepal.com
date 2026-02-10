'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  XCircle,
  AlertCircle,
  Eye,
  DollarSign,
  User,
  Package,
  RefreshCw,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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

export default function PendingBookingsPage() {
  const { t, locale } = useI18n();
  const {
    orders,
    isLoading,
    error,
    fetchCustomerOrders,
  } = useOrderStore();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Mock customer ID - in real app, get from auth
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

  // Filter only pending orders
  const pendingOrders = orders.filter(order => order.order_status === OrderStatus.PENDING);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      // Implement cancel order logic
      toast({
        title: 'Booking Cancelled',
        description: `Booking #${orderId} has been cancelled`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };

  const handleMakePayment = (orderId: number) => {
    // Navigate to payment page
    window.location.href = `/payment/${orderId}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pending Bookings</h1>
          <p className="text-muted-foreground">Bookings waiting for acceptance</p>
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
            <h1 className="text-2xl font-bold text-foreground">Pending Bookings</h1>
            <p className="text-muted-foreground">Bookings waiting for professional acceptance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => window.location.href = '/services'}>
              <Package className="w-4 h-4 mr-2" />
              Book New Service
            </Button>
          </div>
        </div>
      </div>

      {pendingOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-yellow-50">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Pending Bookings</h3>
            <p className="text-muted-foreground mb-6">
              You have no pending bookings at the moment
            </p>
            <Button onClick={() => window.location.href = '/services'}>
              Browse Services
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map((order) => {
            const paymentStatus = order.payment_status as PaymentStatus;
            const paymentInfo = paymentStatusConfig[paymentStatus];
            const remainingAmount = order.payment_summary.remaining_amount;

            return (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Booking Info */}
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0 bg-muted">
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {locale === 'ne' ? order.service_name_np : order.service_name_en}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {locale === 'ne' ? order.service_description_np : order.service_description_en}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                              <Badge className={paymentInfo.color}>
                                {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              Professional: {order.professional_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.scheduled_date)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatTime(order.scheduled_time)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {order.customer_address?.street_address}, {order.customer_address?.municipality}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Order ID: #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.order_date)}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          Rs. {order.total_price}
                        </p>
                      </div>

                      {order.order_notes && (
                        <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">Notes:</span> {order.order_notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-muted/30 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Booking Details</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium">{order.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Quality Type:</span>
                            <span className="font-medium">{order.quality_type_id}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price Unit:</span>
                            <span className="font-medium">{order.price_unit_id}</span>
                          </div>
                        </div>

                        {remainingAmount > 0 && (
                          <div className="mb-4 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              Balance Due: Rs. {remainingAmount}
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
                          onClick={() => {
                            // Handle message
                            toast({
                              title: 'Message Sent',
                              description: 'Message sent to professional',
                            });
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </Button>

                        {paymentStatus !== PaymentStatus.PAID && (
                          <Button
                            size="sm"
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => handleMakePayment(order.id)}
                          >
                            <DollarSign className="w-4 h-4" />
                            Make Payment
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Booking
                        </Button>
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