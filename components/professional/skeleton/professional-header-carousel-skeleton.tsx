// components/professional/skeleton/professional-header-carousel-skeleton.tsx
export function ProfessionalHeaderCarouselSkeleton() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {/* Image skeleton */}
      <div className="absolute inset-0 bg-muted animate-pulse" />
      
      {/* Gradient overlay skeleton */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Name and profession skeleton */}
      <div className="absolute bottom-24 right-6 text-right space-y-2">
        <div className="h-4 w-24 bg-white/30 rounded animate-pulse ml-auto" />
        <div className="h-8 w-32 bg-white/40 rounded animate-pulse ml-auto" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-black/30 backdrop-blur-sm rounded-lg p-3 animate-pulse">
            <div className="h-5 w-16 bg-white/40 rounded mx-auto mb-1" />
            <div className="h-3 w-12 bg-white/30 rounded mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Carousel dots skeleton */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse" />
        ))}
      </div>
    </div>
  );
}