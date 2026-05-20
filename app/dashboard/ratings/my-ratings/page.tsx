'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchReviews, updateReview, deleteReview } from '@/lib/api/reviews';
import { ProfessionalServiceReview } from '@/lib/data/reviews';
import { Order, OrderStatus } from '@/lib/data/order';
import { OrderAPI } from '@/lib/api/order';
import { useUser } from '@/stores/user-store';
import { useI18n } from '@/lib/i18n/context';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { createProfessionalSlug } from '@/lib/utils/slug';
import { RateOrderModal } from '@/components/orders/rate-order-modal';
import { toast } from 'sonner';

export default function MyRatingsPage() {
  const [reviews, setReviews] = useState<ProfessionalServiceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<ProfessionalServiceReview | null>(null);

  // Pending (unrated completed) orders
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [ratingOrderId, setRatingOrderId] = useState<number | null>(null);
  const autoOpenedRef = useRef(false);

  const user = useUser();
  const router = useRouter();
  const { locale } = useI18n();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  useEffect(() => {
    if (user?.id) {
      loadReviews();
      loadPendingOrders();
    }
  }, [user?.id]);

  async function loadReviews() {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReviews({ customer_id: user.id, per_page: 10000 });
      setReviews(data.reviews);
    } catch (err: any) {
      if (err.message?.includes('Authentication required')) {
        setError('auth');
      } else {
        setError(locale === 'ne' ? 'रेटिङहरू लोड गर्न असफल' : 'Failed to load ratings');
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingOrders() {
    if (!user?.id) return;
    try {
      const data = await OrderAPI.getCustomerOrders(user.id, 1, 10000);
      const unrated = data.orders.filter(
        (o) => o.order_status === OrderStatus.COMPLETED && !o.is_rated
      );
      setPendingOrders(unrated);
      // Fallback auto-open: show the first unrated order's rating modal once per visit
      if (unrated.length > 0 && !autoOpenedRef.current) {
        autoOpenedRef.current = true;
        setRatingOrderId(unrated[0].id);
      }
    } catch {
      // silently ignore — pending section simply won't show
    }
  }

  function handleRated(orderId: number) {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
    setRatingOrderId(null);
  }

  async function handleDelete(review: ProfessionalServiceReview) {
    if (!user?.id) return;

    const confirmed = await confirm({
      title: locale === 'ne' ? 'रिभ्यू मेटाउने?' : 'Delete Review?',
      description: locale === 'ne'
        ? 'के तपाईं यो रिभ्यू स्थायी रूपमा मेटाउन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन।'
        : 'Are you sure you want to permanently delete this review? This action cannot be undone.',
      confirmText: locale === 'ne' ? 'हो, मेटाउनुहोस्' : 'Yes, Delete',
      cancelText: locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await deleteReview(review.id, user.id);
      setReviews(prev => prev.filter(r => r.id !== review.id));
      toast.success(locale === 'ne' ? 'रिभ्यू मेटाइयो' : 'Review deleted');
    } catch {
      toast.error(locale === 'ne' ? 'मेटाउन असफल' : 'Failed to delete review');
    }
  }

  function navigateToProfessional(review: ProfessionalServiceReview) {
    const professional = review.professional_service?.professional;
    if (!professional) return;
    const fullName = professional.user?.full_name || '';
    const slug = createProfessionalSlug(fullName, professional.id);
    router.push(`/professionals/${slug}`);
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center mt-12">
          <StarEmptyIcon className="w-20 h-20 mx-auto mb-6 text-muted-foreground/40" />
          <h2 className="text-xl font-semibold mb-3">
            {locale === 'ne' ? 'लगइन आवश्यक' : 'Login Required'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {locale === 'ne' ? 'तपाईंका रिभ्यूहरू हेर्न लगइन गर्नुहोस्' : 'Please login to view your reviews'}
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
          >
            {locale === 'ne' ? 'लगइन गर्नुहोस्' : 'Go to Login'}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48 mb-6" />
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error === 'auth') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center mt-12">
          <StarEmptyIcon className="w-20 h-20 mx-auto mb-6 text-muted-foreground/40" />
          <h2 className="text-xl font-semibold mb-3">
            {locale === 'ne' ? 'लगइन आवश्यक' : 'Login Required'}
          </h2>
          <div className="space-y-3">
            <Link href="/login" className="inline-block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 font-medium">
              {locale === 'ne' ? 'लगइन गर्नुहोस्' : 'Go to Login'}
            </Link>
            <Link href="/" className="inline-block w-full border border-border text-foreground px-6 py-3 rounded-lg hover:bg-muted/50 font-medium">
              {locale === 'ne' ? 'गृह पृष्ठमा फर्कनुहोस्' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {locale === 'ne' ? 'मेरा रिभ्यूहरू' : 'My Reviews'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ne'
            ? 'तपाईंले दिनुभएका सबै रिभ्यू र रेटिङहरू'
            : 'All reviews and ratings you have given'}
        </p>
      </div>

      {error && error !== 'auth' && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive">{error}</p>
          <button onClick={loadReviews} className="mt-2 text-destructive hover:text-destructive/80 font-medium">
            {locale === 'ne' ? 'फेरि प्रयास गर्नुहोस्' : 'Try Again'}
          </button>
        </div>
      )}

      {/* ── Pending Ratings ─────────────────────────────────────── */}
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-semibold text-foreground">
              {locale === 'ne' ? 'रेट गर्न बाँकी' : 'Pending Ratings'}
            </span>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingOrders.map((order) => {
              const svcName = locale === 'ne'
                ? (order.service_name_np || order.service_name_en || '')
                : (order.service_name_en || order.service_name_np || '');
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{svcName || `Order #${order.id}`}</p>
                    {order.professional_name && order.professional_name !== 'Unknown' && (
                      <p className="text-xs text-muted-foreground truncate">{order.professional_name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setRatingOrderId(order.id)}
                    className="shrink-0 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {locale === 'ne' ? 'रेट गर्नुहोस्' : 'Rate Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reviews.length === 0 && !error && pendingOrders.length === 0 && (
        <div className="text-center py-16">
          <StarEmptyIcon className="w-24 h-24 mx-auto mb-6 text-muted-foreground/40" />
          <h3 className="text-xl font-semibold mb-3">
            {locale === 'ne' ? 'कुनै रिभ्यू छैन' : 'No Reviews Yet'}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {locale === 'ne'
              ? 'तपाईंले अहिलेसम्म कुनै सेवालाई रिभ्यू दिनुभएको छैन'
              : "You haven't reviewed any services yet"}
          </p>
          <Link
            href="/services"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
          >
            {locale === 'ne' ? 'सेवाहरू ब्राउज गर्नुहोस्' : 'Browse Services'}
          </Link>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              locale={locale}
              onEdit={() => setEditingReview(review)}
              onDelete={() => handleDelete(review)}
              onCardClick={() => navigateToProfessional(review)}
            />
          ))}
        </div>
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          locale={locale}
          customerId={user.id}
          onClose={() => setEditingReview(null)}
          onSaved={(updated) => {
            setReviews(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
            setEditingReview(null);
          }}
        />
      )}

      {ratingOrderId != null && user?.id && (
        <RateOrderModal
          orderId={ratingOrderId}
          customerId={user.id}
          onClose={() => setRatingOrderId(null)}
          onRated={handleRated}
        />
      )}

      <ConfirmationDialog />
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: ProfessionalServiceReview;
  locale: string;
  onEdit: () => void;
  onDelete: () => void;
  onCardClick: () => void;
}

function ReviewCard({ review, locale, onEdit, onDelete, onCardClick }: ReviewCardProps) {
  const professional = review.professional_service?.professional;
  const professionalName = professional?.user?.full_name || (locale === 'ne' ? 'अज्ञात' : 'Unknown Professional');
  const initial = professionalName.charAt(0).toUpperCase();
  const service = review.professional_service?.service;
  const serviceName = locale === 'ne' ? (service?.name_np || service?.name_en || '') : (service?.name_en || service?.name_np || '');

  return (
    <div
      onClick={onCardClick}
      className="border border-border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50 group bg-card"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-lg font-semibold text-primary">{initial}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary">
                {professionalName}
              </h3>
              {serviceName && (
                <p className="text-sm text-muted-foreground truncate">{serviceName}</p>
              )}
            </div>

            <div
              className="flex items-center gap-1 shrink-0"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={onEdit}
                className="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                title={locale === 'ne' ? 'सम्पादन गर्नुहोस्' : 'Edit'}
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10 transition-colors"
                title={locale === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <StarRow rating={review.rating} size="sm" className="mt-1.5" />

          {review.review && (
            <p className="mt-2 text-sm text-foreground/70 line-clamp-3">"{review.review}"</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  review: ProfessionalServiceReview;
  locale: string;
  customerId: number;
  onClose: () => void;
  onSaved: (updated: Partial<ProfessionalServiceReview>) => void;
}

function EditReviewModal({ review, locale, customerId, onClose, onSaved }: EditModalProps) {
  const [rating, setRating] = useState(review.rating);
  const [text, setText] = useState(review.review || '');
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    if (rating === 0) {
      toast.error(locale === 'ne' ? 'रेटिङ छान्नुहोस्' : 'Please select a rating');
      return;
    }
    if (!text.trim()) {
      toast.error(locale === 'ne' ? 'रिभ्यू लेख्नुहोस्' : 'Please write a review');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await updateReview(review.id, customerId, { rating, review_text: text.trim() });
      onSaved({ ...updated, rating, review: text.trim() });
      toast.success(locale === 'ne' ? 'रिभ्यू अपडेट भयो' : 'Review updated');
    } catch {
      toast.error(locale === 'ne' ? 'अपडेट गर्न असफल' : 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-xl p-6">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-5 sm:hidden" />
        <h2 className="text-lg font-semibold mb-5 text-center text-foreground">
          {locale === 'ne' ? 'रिभ्यू सम्पादन गर्नुहोस्' : 'Edit Review'}
        </h2>

        <div className="flex justify-center gap-1 mb-5">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 ${star <= (hovered || rating) ? 'text-amber-400' : 'text-muted-foreground/30'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={300}
          rows={3}
          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          placeholder={locale === 'ne' ? 'तपाईंको रिभ्यू लेख्नुहोस्...' : 'Write your review...'}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">{text.length}/300</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-foreground py-2.5 rounded-lg font-medium hover:bg-muted/50 transition-colors"
          >
            {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? (locale === 'ne' ? 'सेभ गर्दै...' : 'Saving...')
              : (locale === 'ne' ? 'सेभ गर्नुहोस्' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 'sm', className = '' }: { rating: number; size?: 'sm' | 'md'; className?: string }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${sz} ${i <= rating ? 'text-amber-400' : 'text-muted-foreground/30'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function StarEmptyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
