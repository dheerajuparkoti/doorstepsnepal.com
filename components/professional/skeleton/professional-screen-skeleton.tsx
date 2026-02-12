// components/professional/skeleton/professional-screen-skeleton.tsx
import { ProfessionalHeaderCarouselSkeleton } from './professional-header-carousel-skeleton';
import { ProfessionalLocationBarSkeleton } from './professional-location-bar-skeleton';

export function ProfessionalScreenSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* App Bar Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="flex h-14 items-center px-4">
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          <div className="flex-1 flex justify-center">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ProfessionalHeaderCarouselSkeleton />
        <ProfessionalLocationBarSkeleton />
        
        {/* Tabs Skeleton */}
        <div className="sticky top-0 z-40 bg-background border-b">
          <div className="flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 py-3 px-4">
                <div className="h-5 w-16 bg-muted rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content Skeleton */}
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/70 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted/70 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Buttons Skeleton */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 w-10 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}