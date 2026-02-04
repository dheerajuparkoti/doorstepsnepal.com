export function FeaturedServicesSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="h-10 w-64 rounded bg-muted animate-pulse" />
            <div className="h-4 w-56 rounded bg-muted/50 animate-pulse" />
          </div>
          <div className="h-10 w-32 rounded bg-muted animate-pulse" />
        </div>

        {/* Featured Services Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border bg-background"
            >
              {/* Image Skeleton */}
              <div className="h-40 w-full bg-muted animate-pulse" />

              {/* Content Skeleton */}
              <div className="space-y-3 p-4">
                {/* Service name */}
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />

                {/* Price */}
                <div className="h-3 w-1/2 rounded bg-muted/50 animate-pulse" />

                {/* Quality / Discount */}
                <div className="h-3 w-2/3 rounded bg-muted/50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
