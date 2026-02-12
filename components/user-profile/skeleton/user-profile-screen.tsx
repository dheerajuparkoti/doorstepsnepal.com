import { ProfileHeaderSkeleton } from './header';
import { ProfileLocationBarSkeleton } from './location';
import { ProfileContactInfoSkeleton } from './contact';
import { ProfileActionsSkeleton } from './actions';

interface ProfileScreenSkeletonProps {
  showAppBar?: boolean;
}

export function ProfileScreenSkeleton({ showAppBar = false }: ProfileScreenSkeletonProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showAppBar && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95">
          <div className="flex h-14 items-center px-4">
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
            <div className="flex-1 flex justify-center">
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          </div>
        </header>
      )}
      <div className="flex-1 overflow-y-auto">
        <ProfileHeaderSkeleton />
        <ProfileLocationBarSkeleton />
        <ProfileContactInfoSkeleton />
        <ProfileActionsSkeleton />
      </div>
    </div>
  );
}