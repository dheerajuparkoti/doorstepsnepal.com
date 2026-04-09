'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import type { ProfessionalService, ProfessionalServicePrice } from '@/lib/data/professional-services';
import { Wrench, RefreshCw, ArrowRight, Briefcase, Package, Clock, Tag, Sparkles, TrendingUp, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfessionalServicesViewStore } from '@/stores/professional-service-view-store';
import { useGuestStore } from '@/stores/guest-store'; 
import { createProfessionalSlug, createServiceSlug } from '@/lib/utils/slug';
import { cn } from '@/lib/utils';

interface ProfessionalServicesTabProps {
  professionalId: number;
  services: ProfessionalService[];
}

export function ProfessionalServicesTab({
  professionalId,
  services: initialServices,
}: ProfessionalServicesTabProps) {
  const { language } = useI18n();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const {
    servicesByProfessional,
    fetchServicesByProfessional,
    isLoading
  } = useProfessionalServicesViewStore();

  const services = servicesByProfessional[professionalId] || initialServices;
  const isLoadingServices = isLoading[professionalId] || false;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchServicesByProfessional(professionalId, true);
    setIsRefreshing(false);
  };

  const handleServiceClick = async (service: ProfessionalService) => {
    const { isGuest } = useGuestStore.getState();
    if (isGuest) return;
    if (service.prices.length === 0) return;

  const professionalSlug = createProfessionalSlug(service.professional.user.full_name, service.professional_id);
  const serviceName =service.service?.name_en || 'service';
  const serviceSlug = createServiceSlug(serviceName, service.id);
  router.push(`/professionals/${professionalSlug}/services/${serviceSlug}`);

  };

  const totalPriceOptions = services.reduce((acc, service) => acc + service.prices.length, 0);
  const bestPrice = services.length > 0 
    ? Math.min(...services.flatMap(s => s.prices.map(p => p.price)))
    : 0;

  if (isLoadingServices && services.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-xl animate-pulse" />
            <div className="relative w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            {language === 'ne' ? 'सेवाहRs. लोड हुँदै...' : 'Loading services...'}
          </p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/20 via-secondary/5 to-background border border-border/50 p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative text-center space-y-6 max-w-md mx-auto">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Wrench className="h-10 w-10 text-primary/60" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {language === 'ne' ? 'कुनै सेवा उपलब्ध छैन' : 'No services available'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'ne' 
                ? 'यस प्रोफेशनलले हाल कुनै सेवा प्रदान गरेका छैनन्' 
                : 'This professional hasn\'t added any services yet'}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isRefreshing} 
            className="gap-2 mx-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {language === 'ne' ? 'पुनः लोड गर्नुहोस्' : 'Refresh'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {language === 'ne' ? 'सेवा र मूल्यहRs.' : 'Services & Pricing'}
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                {services.length} {language === 'ne' ? 'सेवाहRs.' : 'services'}
              </Badge>
            </div>
            <p className="text-muted-foreground ml-4">
              {language === 'ne' 
                ? 'सबै सेवाहRs. र मूल्य निर्धारण विकल्पहRs. हेर्नुहोस्' 
                : 'Browse all services and pricing options'}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 text-muted-foreground hover:text-foreground self-start sm:self-center group"
          >
            <RefreshCw className={`h-4 w-4 transition-transform group-hover:rotate-180 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {language === 'ne' ? 'ताजा गर्नुहोस्' : 'Refresh'}
            </span>
          </Button>
        </div>
      </div>

      {/* Stats as floating chips */}
      <div className="flex flex-wrap gap-3 px-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-full border border-border/50">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{services.length}</span>
          <span className="text-sm text-muted-foreground">
            {language === 'ne' ? 'सेवाहRs.' : 'services'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-full border border-border/50">
          <Package className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium">{totalPriceOptions}</span>
          <span className="text-sm text-muted-foreground">
            {language === 'ne' ? 'मूल्य विकल्प' : 'price options'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-full border border-amber-200/50">
          <Tag className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">
            Rs. {bestPrice.toLocaleString()}
          </span>
          <span className="text-sm text-amber-600">
            {language === 'ne' ? 'सुरु' : 'start'}
          </span>
        </div>
      </div>

      {/* Services as accordion/timeline */}
      <div className="space-y-3 px-6">
        {services.map((service, index) => {
          const baseService = service.service;
          const minPrice = Math.min(...service.prices.map(p => p.price));
          const maxPrice = Math.max(...service.prices.map(p => p.price));
          const hasMultiplePrices = service.prices.length > 1;
          const isSelected = selectedService === service.id;

          return (
            <div
              key={service.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/50 transition-all duration-300",
                "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                isSelected ? "border-primary/30 bg-gradient-to-r from-primary/5 to-transparent" : "bg-background"
              )}
            >
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
              
              {/* Service header - clickable */}
              <div
                className="relative p-6 cursor-pointer"
                onClick={() => setSelectedService(isSelected ? null : service.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isSelected 
                        ? "bg-primary text-white scale-110" 
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    )}>
                      <Wrench className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={cn(
                          "text-lg font-semibold transition-colors",
                          isSelected ? "text-primary" : "group-hover:text-primary"
                        )}>
                          {language === 'ne' 
                            ? baseService?.name_np || baseService?.name_en || 'Unknown Service'
                            : baseService?.name_en || 'Unknown Service'}
                        </h3>
                        
                        {/* Price summary as pill */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 rounded-full">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {service.prices.length} {language === 'ne' ? 'विकल्प' : 'options'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span className="text-sm font-semibold text-foreground">
                              Rs. {minPrice.toLocaleString()}
                              {hasMultiplePrices && ` - Rs. ${maxPrice.toLocaleString()}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={cn(
                        "h-5 w-5 transition-all duration-300 flex-shrink-0",
                        isSelected ? "rotate-90 text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded pricing section */}
              {isSelected && (
                <div className="relative px-6 pb-6 pt-2 ml-12 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    {/* Pricing as horizontal scroll */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {service.prices.map((price: ProfessionalServicePrice) => (
                        <ProfessionalPriceTile key={price.id} price={price} />
                      ))}
                    </div>

                    {/* View all button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-2 text-primary hover:text-primary/80 hover:bg-primary/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(service);
                      }}
                    >
                      <span>{language === 'ne' ? 'सबै विवरण हेर्नुहोस्' : 'View all details'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfessionalPriceTile({ price }: { price: ProfessionalServicePrice }) {
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
    <div className="flex-shrink-0 w-56 group/tile relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-secondary/5 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
      {/* Discount ribbon */}
      {hasDiscount && (
        <div className="absolute top-0 right-0">
          <div className="relative">
            <div className="absolute top-0 right-0 w-16 h-16">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold py-1 right-[-35px] top-[15px] w-[120px] text-center">
                {price.discount_percentage}% OFF
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Price */}
        <div className="space-y-1 mb-3">
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through block">
              Rs. {originalPrice.toLocaleString()}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Rs. {discountedPrice.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/{unit}</span>
          </div>
        </div>

        {/* Quality badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-primary/5 text-xs border-0">
            {quality}
          </Badge>
          {price.is_minimum_price && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 text-xs border-0">
              {language === 'ne' ? 'सुरु' : 'Start'}
            </Badge>
          )}
        </div>

        {/* Discount name if available */}
        {hasDiscount && price.discount_name && (
          <div className="text-xs text-primary/70 flex items-center gap-1 pt-2 border-t border-border/50">
            <Sparkles className="h-3 w-3" />
            <span className="truncate">{price.discount_name}</span>
          </div>
        )}

        {/* Warranty badge */}
        {price.has_warranty && (
          <div className="text-xs text-emerald-600 flex items-center gap-1 pt-2 border-t border-border/50">
            <ShieldCheck className="h-3 w-3" />
            <span>{price.warranty_duration} {price.warranty_unit} {language === 'ne' ? 'वारेन्टी' : 'warranty'}</span>
          </div>
        )}
      </div>
    </div>
  );
}