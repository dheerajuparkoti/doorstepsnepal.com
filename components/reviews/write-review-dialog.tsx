// components/reviews/write-review-dialog.tsx
'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useI18n } from '@/lib/i18n/context';
import { createReview } from '@/lib/api/reviews';
import { useUserStore } from '@/stores/user-store';

export interface WriteReviewDialogProps {
  /** The ID of the professional service being reviewed (required) */
  professionalServiceId: number;
  /** The name of the service/professional being reviewed */
  targetName: string;
  /** Custom trigger button (optional) */
  trigger?: React.ReactNode;
  /** Whether the dialog is open (for controlled state) */
  open?: boolean;
  /** Callback when open state changes (for controlled state) */
  onOpenChange?: (open: boolean) => void;
  /** Callback when review is successfully submitted */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** The type of target being reviewed */
  targetType: 'professional' | 'service' | 'order';
  /** Pre-fill rating (optional) */
  initialRating?: number;
  /** Pre-fill review text (optional) */
  initialReview?: string;
}

export function WriteReviewDialog({
  professionalServiceId,
  targetName,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
  className,
  targetType,
  initialRating = 0,
  initialReview = '',
}: WriteReviewDialogProps) {
  const { t, locale } = useI18n();
  const { user } = useUserStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Use controlled or uncontrolled open state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  const getLocalizedText = (en: string, np: string) => {
    return locale === 'ne' ? np : en;
  };

  const resetForm = () => {
    setRating(initialRating);
    setReviewText(initialReview);
    setHoveredRating(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Please select a rating', 'कृपया मूल्याङ्कन चयन गर्नुहोस्'),
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('You must be logged in to submit a review', 'समीक्षा पेश गर्न तपाईं लगइन हुनु पर्छ'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createReview(
        professionalServiceId,
        {
          rating,
          review: reviewText,
        },
        user.id
      );

      toast({
        title: getLocalizedText('Review Submitted', 'समीक्षा पेश गरियो'),
        description: getLocalizedText(
          'Thank you for your feedback!', 
          'तपाईंको प्रतिक्रियाको लागि धन्यवाद!'
        ),
      });

      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      // Handle specific error messages from API
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          getLocalizedText(
                            'Failed to submit review. Please try again.',
                            'समीक्षा पेश गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।'
                          );
      
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get dialog title and description based on target type
  const getDialogTitle = () => {
    switch (targetType) {
      case 'professional':
        return getLocalizedText(
          `Rate ${targetName}`,
          `${targetName} लाई मूल्याङ्कन गर्नुहोस्`
        );
      case 'service':
        return getLocalizedText(
          `Rate ${targetName} Service`,
          `${targetName} सेवालाई मूल्याङ्कन गर्नुहोस्`
        );
      case 'order':
        return getLocalizedText(
          'Rate Your Experience',
          'आफ्नो अनुभव मूल्याङ्कन गर्नुहोस्'
        );
      default:
        return getLocalizedText('Write a Review', 'समीक्षा लेख्नुहोस्');
    }
  };

  const getDialogDescription = () => {
    switch (targetType) {
      case 'professional':
        return getLocalizedText(
          `Share your experience working with ${targetName}`,
          `${targetName} संगको आफ्नो अनुभव साझा गर्नुहोस्`
        );
      case 'service':
        return getLocalizedText(
          `Share your feedback about the ${targetName} service`,
          `${targetName} सेवाको बारेमा आफ्नो प्रतिक्रिया साझा गर्नुहोस्`
        );
      case 'order':
        return getLocalizedText(
          'Share your feedback about this service',
          'यस सेवाको बारेमा आफ्नो प्रतिक्रिया साझा गर्नुहोस्'
        );
      default:
        return getLocalizedText(
          'Share your experience',
          'आफ्नो अनुभव साझा गर्नुहोस्'
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className={`sm:max-w-md ${className}`}>
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-center block">
              {getLocalizedText('Your Rating', 'तपाईंको मूल्याङ्कन')}
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && getLocalizedText('Poor', 'कमजोर')}
                {rating === 2 && getLocalizedText('Fair', 'सामान्य')}
                {rating === 3 && getLocalizedText('Good', 'राम्रो')}
                {rating === 4 && getLocalizedText('Very Good', 'धेरै राम्रो')}
                {rating === 5 && getLocalizedText('Excellent', 'उत्कृष्ट')}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {getLocalizedText('Your Review', 'तपाईंको समीक्षा')}
            </label>
            <Textarea
              placeholder={getLocalizedText(
                'Share your experience in detail...',
                'आफ्नो अनुभव विस्तृत रूपमा साझा गर्नुहोस्...'
              )}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewText.length}/500
            </p>
          </div>

          {/* Helpful tips */}
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">
              {getLocalizedText('Tips for writing a helpful review:', 'उपयोगी समीक्षा लेख्नका लागि सुझावहरू:')}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                {getLocalizedText(
                  'Be specific about your experience',
                  'आफ्नो अनुभवको बारेमा विशिष्ट हुनुहोस्'
                )}
              </li>
              <li>
                {getLocalizedText(
                  'Mention what went well and what could be improved',
                  'के राम्रो भयो र के सुधार गर्न सकिन्छ उल्लेख गर्नुहोस्'
                )}
              </li>
              <li>
                {getLocalizedText(
                  'Keep it respectful and constructive',
                  'सम्मानजनक र रचनात्मक राख्नुहोस्'
                )}
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 sm:flex-none bg-yellow-600 hover:bg-yellow-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {getLocalizedText('Submitting...', 'पेश गर्दै...')}
              </>
            ) : (
              getLocalizedText('Submit Review', 'समीक्षा पेश गर्नुहोस्')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}