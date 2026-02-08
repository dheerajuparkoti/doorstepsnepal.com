export function ProfessionalsSkeleton() {
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
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="h-3 w-16 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
                
                <div>
                  <div className="h-3 w-12 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
                
                <div>
                  <div className="h-3 w-20 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
                
                <div>
                  <div className="h-3 w-14 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                </div>
                
                <div className="flex gap-2 pt-4">
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