export function ProfileHeaderSkeleton() {
  return (
    <div className="relative w-full h-[400px] bg-muted animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute top-4 right-4 h-10 w-10 bg-white/20 rounded-full" />
      <div className="absolute bottom-24 left-6 right-6 space-y-3">
        <div className="h-6 w-24 bg-white/20 rounded-full" />
        <div className="h-10 w-32 bg-white/30 rounded-lg" />
        <div className="h-6 w-40 bg-white/20 rounded-lg" />
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-black/40 backdrop-blur-sm rounded-lg p-3">
            <div className="h-5 w-12 bg-white/30 rounded mx-auto mb-1" />
            <div className="h-3 w-16 bg-white/20 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}