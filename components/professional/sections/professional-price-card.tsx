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
      "flex-shrink-0 w-44 bg-secondary/10 hover:bg-secondary/20 rounded-lg p-3 transition-colors border border-border/50",
      className
    )}>
      {/* Discount badge */}
      {hasDiscount && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground line-through">
            Rs. {originalPrice.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            {price.discount_percentage}% OFF
          </span>
        </div>
      )}
      
      {/* Price */}
      <div className="space-y-0.5">
        <div className="flex items-baseline gap-1">
          {price.is_minimum_price && (
            <span className="text-xs text-primary font-medium">
              {language === 'ne' ? 'सुरु' : 'Start'}{' '}
            </span>
          )}
          <span className="text-base font-bold text-foreground">
            Rs. {discountedPrice.toLocaleString()}
          </span>
        </div>
        
        {/* Unit & Quality */}
        <p className="text-xs text-muted-foreground">
          {unit} • {quality}
        </p>
      </div>

      {/* Discount name if available */}
      {hasDiscount && price.discount_name && (
        <p className="text-xs text-primary/70 mt-2 pt-2 border-t border-border/50">
          {price.discount_name}
        </p>
      )}
    </div>
  );
}

