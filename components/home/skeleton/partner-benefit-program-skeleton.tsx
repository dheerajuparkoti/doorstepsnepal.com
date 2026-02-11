export function PartnerBenefitProgramSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="h-6 w-48 rounded bg-muted animate-pulse mx-auto mb-4" />
          <div className="h-10 w-64 rounded bg-muted animate-pulse mx-auto mb-4" />
          <div className="h-4 w-96 rounded bg-muted/50 animate-pulse mx-auto" />
        </div>

        {/* Main Card Skeleton */}
        <div className="mb-12">
          <div className="h-48 rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Two Column Grid Skeleton */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                <div className="h-6 w-48 rounded bg-muted animate-pulse" />
              </div>
              
              <div className="rounded-lg border bg-background overflow-hidden">
                <div className="h-12 bg-muted/30 animate-pulse" />
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="p-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                      </div>
                      <div className="h-6 w-16 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
                <div className="h-12 bg-muted/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid Skeleton */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="h-8 w-64 rounded bg-muted animate-pulse mx-auto mb-4" />
            <div className="h-4 w-96 rounded bg-muted/50 animate-pulse mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-background p-6">
                <div className="h-12 w-12 rounded-lg bg-muted animate-pulse mb-4" />
                <div className="h-5 w-32 rounded bg-muted animate-pulse mb-3" />
                <div className="h-3 w-full rounded bg-muted/50 animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-muted/50 animate-pulse mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="rounded-lg bg-muted/30 p-8">
          <div className="h-8 w-64 rounded bg-muted animate-pulse mx-auto mb-4" />
          <div className="h-4 w-96 rounded bg-muted/50 animate-pulse mx-auto mb-6" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 w-40 rounded bg-muted animate-pulse" />
            <div className="h-12 w-40 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}