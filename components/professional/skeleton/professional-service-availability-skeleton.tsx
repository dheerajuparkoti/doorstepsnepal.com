// components/professional/skeleton/professional-availability-tab-skeleton.tsx
export function ProfessionalAvailabilityTabSkeleton() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
            <div className="h-6 w-20 bg-muted rounded animate-pulse mx-auto" />
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse mx-auto" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
              <div className="h-4 w-20 bg-muted/70 rounded animate-pulse mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}