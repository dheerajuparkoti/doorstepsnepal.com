export function PromotionsCarouselSkeleton() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
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
              className="flex-shrink-0 w-[300px] md:w-[400px] lg:w-[500px] space-y-4"
            >
              <div className="h-[400px] md:h-[450px] w-full rounded-2xl bg-muted animate-pulse" />
              <div className="space-y-2 px-2">
                <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted/50 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-muted/50 animate-pulse" />
                <div className="h-10 w-32 rounded bg-muted animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}