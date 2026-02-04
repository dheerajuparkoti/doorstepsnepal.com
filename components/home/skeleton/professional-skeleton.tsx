export function ProfessionalsSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex justify-between">
          <div className="space-y-3">
            <div className="h-8 w-56 rounded bg-muted animate-pulse" />
            <div className="h-4 w-72 rounded bg-muted/50 animate-pulse" />
          </div>
          <div className="h-10 w-32 rounded bg-muted animate-pulse" />
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg border p-6"
            >
              <div className="mb-4 h-24 w-24 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="mt-2 h-3 w-40 rounded bg-muted/50 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
