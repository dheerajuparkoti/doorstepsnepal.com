export function ProfileLocationBarSkeleton() {
  return (
    <div className="w-full bg-muted/30 px-4 py-3 border-y">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}