// components/professional/skeleton/professional-price-card-skeleton.tsx
export function ProfessionalPriceCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-40 bg-black/30 backdrop-blur-sm rounded-lg p-3 space-y-2">
      <div className="h-3 w-16 bg-white/40 rounded animate-pulse" />
      <div className="h-5 w-24 bg-white/50 rounded animate-pulse" />
      <div className="h-4 w-20 bg-white/30 rounded animate-pulse" />
    </div>
  );
}