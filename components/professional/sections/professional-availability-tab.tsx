// components/professional/sections/professional-availability-tab.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import { useServiceAvailabilityViewStore } from '@/stores/professional-service-availability-view-store';
import type { ServiceAvailability } from '@/lib/data/service-availability';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Key, useState } from 'react';

interface ProfessionalAvailabilityTabProps {
  professionalId: number;
  availabilities: ServiceAvailability[];
}

export function ProfessionalAvailabilityTab({
  professionalId,
  availabilities: initialAvailabilities,
}: ProfessionalAvailabilityTabProps) {
  const { language } = useI18n();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    availabilitiesByProfessional,
    fetchAvailabilities,
    formatTimeForDisplay,
    getDayNameInNepali,
    isLoading
  } = useServiceAvailabilityViewStore();

  const availabilities = availabilitiesByProfessional[professionalId] || initialAvailabilities;
  const isLoadingAvailabilities = isLoading[professionalId] || false;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAvailabilities(professionalId, true);
    setIsRefreshing(false);
  };

  if (isLoadingAvailabilities && availabilities.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (availabilities.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">
          {language === 'ne' 
            ? 'कुनै समय उपलब्ध छैन' 
            : 'No availability slots set'}
        </p>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {language === 'ne' ? 'पुनः लोड गर्नुहोस्' : 'Refresh'}
        </Button>
      </div>
    );
  }

  // Group availabilities by day
  const groupedByDay = availabilities.reduce((acc: { [x: string]: any[]; }, slot: { day_of_week: string | number; }) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<string, ServiceAvailability[]>);

  // Sort days in week order
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedDays.map((day) => {
          const daySlots = groupedByDay[day];
          
          return (
            <Card key={day} className="overflow-hidden">
              <CardContent className="p-4">
                <h4 className="font-semibold text-center mb-3">
                  {language === 'ne' ? getDayNameInNepali(day) : day}
                </h4>
                
                <div className="space-y-2">
                  {daySlots.map((slot: { id: Key | null | undefined; start_time: any; end_time: any; }) => (
                    <div
                      key={slot.id}
                      className="text-sm bg-muted/50 rounded-md p-2 text-center"
                    >
                      <p className="font-medium">
                        {formatTimeForDisplay(slot.start_time)} - {formatTimeForDisplay(slot.end_time)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}