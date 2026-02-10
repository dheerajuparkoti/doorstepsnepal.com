'use client';

import { useEffect, useState } from 'react';
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
  CheckCircle,
  User,
  RefreshCw,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompletedBookingsPage() {
  const { t, locale } = useI18n();
  const {
    orders,
    isLoading,
    error,
    fetchCustomerOrders,
  } = useOrderStore();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  // Filter only completed orders
  const completedOrders = orders.filter(order => order.order_status === OrderStatus.COMPLETED);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleWriteReview = (order: any) => {
    setSelectedOrder(order);
    setReviewRating(0);
    setReviewText('');
  };

  const submitReview = async () => {
    if (!selectedOrder) return;
    
    if (reviewRating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Submit review logic here
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });
      setSelectedOrder(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Completed Bookings</h1>
          <p className="text-muted-foreground">Completed service bookings</p>
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
            <h1 className="text-2xl font-bold text-foreground">Completed Bookings</h1>
            <p className="text-muted-foreground">Completed service bookings</p>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {completedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Completed Bookings</h3>
            <p className="text-muted-foreground mb-6">
              You have no completed bookings at the moment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Booking Info */}
                  <div className="p-4 sm:p-6 flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0 bg-green-50">
                        <div className="w-full h-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-500" />
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
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3 text-sm mt-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.scheduled_date)}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-medium">Amount Paid:</span>
                            <span className="text-primary font-bold">Rs. {order.total_price}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-3">
                          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                          <span>
                            {order.customer_address?.street_address}, {order.customer_address?.municipality}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Order ID: #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Completed on {formatDate(order.order_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium">
                          Payment Status: Paid
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: Rs. {order.total_price}
                        </p>
                      </div>
                    </div>

                    {order.order_notes && (
                      <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">Notes:</span> {order.order_notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-green-50/30 dark:bg-green-950/10 flex flex-col justify-between">
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
                          <div className="flex justify-between">
                            <span>Price Unit:</span>
                            <span className="font-medium">{order.price_unit_id}</span>
                          </div>
                        </div>
                      </div>
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
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="gap-2 bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => handleWriteReview(order)}
                          >
                            <Star className="w-4 h-4" />
                            Write Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rate Your Experience</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      star <= reviewRating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <Textarea
                              placeholder="Share your experience with this service..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              rows={4}
                            />
                            <Button onClick={submitReview} className="w-full">
                              Submit Review
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.open(`tel:${order.customer_phone}`)}
                      >
                        <Phone className="w-4 h-4" />
                        Contact Professional
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}