// components/professional/sections/professional-services-tab.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { ProfessionalPriceCard } from './professional-price-card';
import type { ProfessionalService, ProfessionalServicePrice } from '@/lib/data/professional-services';
import { Wrench, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProfessionalServicesViewStore } from '@/stores/professional-service-view-store';
import { useGuestStore } from '@/stores/guest-store'; 
import { useFavoriteStore } from '@/stores/favorite-store'; 

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

  const {
    servicesByProfessional,
    fetchServicesByProfessional,
    isLoading
  } = useProfessionalServicesViewStore();

  // Use store data if available, otherwise use initial data
  const services = servicesByProfessional[professionalId] || initialServices;
  const isLoadingServices = isLoading[professionalId] || false;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchServicesByProfessional(professionalId, true);
    setIsRefreshing(false);
  };

  const handleServiceClick = async (service: ProfessionalService) => {
    // Check guest mode
    const { isGuest } = useGuestStore.getState();
    if (isGuest) {
      // Show guest dialog
      return;
    }

    if (service.prices.length === 0) {
      // Show snackbar/toast
      return;
    }

    router.push(`/pro-services-list?professionalId=${professionalId}&serviceId=${service.service_id}`);
  };

  if (isLoadingServices && services.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <Wrench className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">
          {language === 'ne' 
            ? 'कुनै सेवा उपलब्ध छैन' 
            : 'No services available'}
        </p>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {language === 'ne' ? 'पुनः लोड गर्नुहोस्' : 'Refresh'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const baseService = service.service;
          const category = baseService?.category_id; // You'll need to fetch categories

          return (
            <Card 
              key={service.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      {language === 'ne' 
                        ? baseService?.name_np || baseService?.name_en || 'Unknown Service'
                        : baseService?.name_en || 'Unknown Service'}
                    </h4>
                    {/* Category name - you'll need to map this */}
                    <p className="text-xs text-muted-foreground">
                      {/* Category name here */}
                    </p>
                  </div>
                </div>

                {service.prices.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {service.prices.map((price: ProfessionalServicePrice) => (
                      <ProfessionalPriceCard key={price.id} price={price} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}