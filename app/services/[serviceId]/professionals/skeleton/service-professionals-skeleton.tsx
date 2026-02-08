export function ServiceProfessionalsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-primary text-primary-foreground/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-primary-foreground/20 rounded animate-pulse" />
              <div className="h-3 w-24 bg-primary-foreground/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filter Section Skeleton */}
        <div className="mb-6">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-3" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden">
              {/* Image Skeleton */}
              <div className="h-48 w-full bg-muted animate-pulse" />
              
              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <div className="h-3 w-12 bg-muted/50 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
                  <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}