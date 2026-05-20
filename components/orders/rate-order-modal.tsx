'use client';

import { useState, useEffect } from 'react';
import { OrderAPI } from '@/lib/api/order';
import { createReview } from '@/lib/api/reviews';
import { Order } from '@/lib/data/order';
import { useI18n } from '@/lib/i18n/context';
import { toast } from 'sonner';

interface RateOrderModalProps {
  orderId: number;
  customerId: number;
  onClose: () => void;
  onRated: (orderId: number) => void;
}

export function RateOrderModal({ orderId, customerId, onClose, onRated }: RateOrderModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { locale } = useI18n();

  useEffect(() => {
    setLoadingOrder(true);
    OrderAPI.getOrderById(orderId)
      .then(setOrder)
      .catch(() => toast.error(locale === 'ne' ? 'अर्डर लोड गर्न असफल' : 'Failed to load order'))
      .finally(() => setLoadingOrder(false));
  }, [orderId]);

  async function handleSubmit() {
    if (rating === 0) {
      toast.error(locale === 'ne' ? 'कृपया रेटिङ छान्नुहोस्' : 'Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      toast.error(locale === 'ne' ? 'कृपया रिभ्यू लेख्नुहोस्' : 'Please write a review');
      return;
    }
    if (!order) return;

    setSubmitting(true);
    try {
      await createReview(
        order.professional_service_id,
        { rating, review: reviewText.trim(), order_id: orderId },
        customerId,
      );
      toast.success(locale === 'ne' ? 'रिभ्यू सफलतापूर्वक पठाइयो!' : 'Review submitted!');
      onRated(orderId);
      onClose();
    } catch {
      toast.error(locale === 'ne' ? 'रिभ्यू पठाउन असफल' : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  const serviceName = locale === 'ne'
    ? (order?.service_name_np || order?.service_name_en || '')
    : (order?.service_name_en || order?.service_name_np || '');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-xl">
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-4 sm:hidden" />

        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-lg font-bold text-center text-foreground">
            {locale === 'ne' ? 'सेवा मूल्याङ्कन गर्नुहोस्' : 'Rate Service'}
          </h2>

          {/* Order context card */}
          {loadingOrder ? (
            <div className="h-16 bg-muted rounded-xl animate-pulse" />
          ) : order && (
            <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-1.5">
              {serviceName ? (
                <p className="font-semibold text-sm text-foreground leading-snug">{serviceName}</p>
              ) : null}
              {order.professional_name && order.professional_name !== 'Unknown' && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {order.professional_name}
                </p>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                {locale === 'ne' ? 'अर्डर' : 'Order'} #{order.id}
              </p>
            </div>
          )}

          {/* Star rating */}
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <svg
                  className={`w-9 h-9 transition-colors ${star <= (hovered || rating) ? 'text-amber-400' : 'text-muted-foreground/30'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          {/* Review text */}
          <div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
              placeholder={locale === 'ne' ? 'तपाईंको अनुभव लेख्नुहोस्...' : 'Write about your experience...'}
            />
            <p className="text-xs text-muted-foreground text-right mt-0.5">{reviewText.length}/300</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-border text-foreground py-2.5 rounded-lg font-medium hover:bg-muted/50 transition-colors"
            >
              {locale === 'ne' ? 'पछि गर्नुहोस्' : 'Later'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || loadingOrder || !order}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? (locale === 'ne' ? 'पठाउँदै...' : 'Submitting...')
                : (locale === 'ne' ? 'पठाउनुहोस्' : 'Submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
