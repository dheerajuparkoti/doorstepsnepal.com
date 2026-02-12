// components/professional/sections/professional-reviews-tab.tsx
'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useReviewsStore } from '@/stores/review-store';
import type { ProfessionalServiceReview } from '@/lib/data/reviews';
import { Star, StarHalf, Users, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfessionalReviewsTabProps {
  professionalId: number;
  initialReviews: ProfessionalServiceReview[];
}

export function ProfessionalReviewsTab({
  professionalId,
  initialReviews,
}: ProfessionalReviewsTabProps) {
  const { language } = useI18n();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    reviewsByProfessional,
    fetchReviews,
    toggleViewMode,
    getViewMode,
    // isLoading
  } = useReviewsStore();

  const storeData = reviewsByProfessional[professionalId];
  const reviews = storeData?.reviews || initialReviews;
  const groupedReviews = storeData?.groupedReviews || {};
  const viewMode = getViewMode(professionalId);
  const isLoadingReviews = storeData?.isLoading || false;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReviews(professionalId, { page: 1, per_page: 10000 }, true);
    setIsRefreshing(false);
  };

  const handleToggleView = () => {
    toggleViewMode(professionalId);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }
    return stars;
  };

  const ReviewCard = ({ review }: { review: ProfessionalServiceReview }) => {
    const customerName = review.customer?.full_name || 'Anonymous';
    const reviewText = review.review || '';
    const rating = review.rating;
    const serviceName = review.professional_service?.service?.name_en || 'Service';
    const initials = customerName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{customerName}</h4>
                <div className="flex items-center gap-0.5">
                  {renderStars(rating)}
                </div>
              </div>
              
              {reviewText && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  "{reviewText}"
                </p>
              )}
              
              <p className="text-xs text-muted-foreground">
                {language === 'ne' ? 'सेवा' : 'Service'}: {serviceName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoadingReviews && reviews.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">
          {language === 'ne' ? 'कुनै समीक्षा छैन' : 'No reviews yet'}
        </p>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {language === 'ne' ? 'पुनः लोड गर्नुहोस्' : 'Refresh'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Toggle View Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleView}
          className="gap-2"
        >
          {viewMode === 'chronological' ? (
            <>
              <Calendar className="h-4 w-4" />
              {language === 'ne' ? 'सेवा अनुसार हेर्नुहोस्' : 'Group by Service'}
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              {language === 'ne' ? 'क्रमबद्ध हेर्नुहोस्' : 'Show Chronological'}
            </>
          )}
        </Button>
      </div>

      {/* Reviews Grid */}
      {viewMode === 'chronological' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedReviews).map(([serviceName, serviceReviews]) => (
            <div key={serviceName} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">
                {serviceName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceReviews.map((review: ProfessionalServiceReview) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}