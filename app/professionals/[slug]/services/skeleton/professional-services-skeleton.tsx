
export function ProfessionalServicesSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-primary">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <div className="h-10 w-10 rounded-full bg-primary-foreground/20 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-primary-foreground/20 rounded animate-pulse" />
            <div className="h-3 w-24 bg-primary-foreground/20 rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-4 h-6 w-32 bg-muted rounded animate-pulse" />
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-muted/50 rounded animate-pulse" />
                </div>
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}