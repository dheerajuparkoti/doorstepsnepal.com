export function ProfileActionsSkeleton() {
  return (
    <div className="px-4 py-6 space-y-4">
      <div className="h-6 w-24 bg-muted rounded animate-pulse" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 bg-muted rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted/70 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}