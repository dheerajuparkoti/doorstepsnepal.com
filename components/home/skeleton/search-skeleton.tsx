export function SearchSkeleton() {
  return (
    <section className="relative -mt-10 z-20 px-4">
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-md md:p-5 dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input Skeleton */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded bg-gray-300" />
              <div className="h-14 rounded-xl bg-gray-200 animate-pulse" />
            </div>
            
            {/* Filter Button Skeleton */}
            <div className="h-14 w-32 rounded-xl bg-gray-200 animate-pulse" />
            
            {/* Search Button Skeleton */}
            <div className="h-14 w-32 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}