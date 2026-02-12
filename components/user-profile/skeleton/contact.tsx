import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProfileContactInfoSkeleton() {
  return (
    <Card className="mx-4 mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted/70 rounded animate-pulse" />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted/70 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-28 bg-muted/70 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}