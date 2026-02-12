// components/professional/sections/professional-price-card.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import type { ProfessionalServicePrice } from '@/lib/data/professional-services';
import { cn } from '@/lib/utils';

interface ProfessionalPriceCardProps {
  price: ProfessionalServicePrice;
  className?: string;
}

export function ProfessionalPriceCard({ price, className }: ProfessionalPriceCardProps) {
  const { language } = useI18n();

  const hasDiscount = price.discount_is_active && 
    price.discount_percentage != null && 
    price.discount_percentage > 0;

  const originalPrice = price.price;
  const discountedPrice = hasDiscount
    ? Math.floor(originalPrice - (originalPrice * (price.discount_percentage! / 100)))
    : Math.floor(originalPrice);

  const unit = price.price_unit?.name || '';
  const quality = price.quality_type?.name || '';

  return (
    <div className={cn(
      "flex-shrink-0 w-40 bg-black/30 backdrop-blur-sm rounded-lg p-3",
      className
    )}>
      {hasDiscount && (
        <p className="text-xs text-white/70 line-through decoration-red-400">
          Rs. {originalPrice}/-
        </p>
      )}
      
      <div className="space-y-0.5">
        {price.is_minimum_price && (
          <span className="text-xs text-orange-400 font-semibold">
            {language === 'ne' ? 'सुरु' : 'Starting at'}{' '}
          </span>
        )}
        <span className="text-sm font-bold text-white">
          Rs. {discountedPrice}/-
        </span>
        <span className="text-xs text-white/70 ml-1">
          ({unit}, {quality})
        </span>
      </div>

      {hasDiscount && (
        <p className="text-xs text-yellow-400 font-semibold mt-1">
          {price.discount_percentage}% OFF
          {price.discount_name && ` - ${price.discount_name}`}
        </p>
      )}
    </div>
  );
}