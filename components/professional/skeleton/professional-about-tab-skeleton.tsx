// components/professional/skeleton/professional-about-tab-skeleton.tsx
export function ProfessionalAboutTabSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* About text skeleton */}
      <div>
        <div className="h-5 w-24 bg-muted rounded animate-pulse mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
        </div>
      </div>
      
      {/* Skills skeleton */}
      <div>
        <div className="h-5 w-16 bg-muted rounded animate-pulse mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Service areas skeleton */}
      <div>
        <div className="h-5 w-24 bg-muted rounded animate-pulse mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-28 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}