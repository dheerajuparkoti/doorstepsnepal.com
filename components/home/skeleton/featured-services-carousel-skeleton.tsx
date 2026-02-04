export function FeaturedServicesCarouselSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-64 rounded bg-muted animate-pulse" />
            <div className="h-4 w-48 rounded bg-muted/50 animate-pulse" />
          </div>
          <div className="h-10 w-32 rounded bg-muted animate-pulse" />
        </div>

        {/* Carousel cards */}
        <div className="flex gap-6 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%] space-y-4"
            >
              <div className="h-56 w-full rounded-lg bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted/50 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-muted/50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
