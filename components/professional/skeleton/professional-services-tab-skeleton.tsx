// components/professional/skeleton/professional-services-tab-skeleton.tsx
export function ProfessionalServicesTabSkeleton() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
            {/* Service header */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted/70 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Price cards */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2].map((j) => (
                <div key={j} className="flex-shrink-0 w-40 bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-20 bg-muted/70 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}