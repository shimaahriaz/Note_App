export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <header className="border-b border-[var(--note-border)] bg-white/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
            <div className="h-7 w-32 bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-64 bg-muted rounded-full animate-pulse" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Form Skeleton */}
        <div className="bg-white border border-[var(--note-border)] rounded-2xl p-6 space-y-3">
          <div className="h-6 w-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          <div className="h-28 w-full bg-muted rounded-xl animate-pulse" />
          <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
        </div>

        {/* Notes Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[var(--note-border)] rounded-2xl p-5 space-y-3 h-44"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-5 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-full bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-2/3 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="pt-3 border-t border-[var(--note-border)] flex justify-between">
                <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-muted rounded-lg animate-pulse" />
                  <div className="h-6 w-6 bg-muted rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}