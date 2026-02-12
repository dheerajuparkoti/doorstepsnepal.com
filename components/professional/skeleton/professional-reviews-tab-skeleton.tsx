// components/professional/skeleton/professional-reviews-tab-skeleton.tsx
export function ProfessionalReviewsTabSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Toggle button skeleton */}
      <div className="flex justify-center">
        <div className="h-9 w-48 bg-muted rounded-full animate-pulse" />
      </div>
      
      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-4 w-4 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/70 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/70 rounded animate-pulse" />
            </div>
            <div className="h-3 w-32 bg-muted/50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}