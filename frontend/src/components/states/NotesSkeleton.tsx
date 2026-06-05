export function NotesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="
            h-44
            w-full
            rounded-xl
            border border-amber-200
            bg-amber-50
            p-4
            shadow-sm
            animate-pulse
          "
        >
          {/* Title skeleton */}
          <div className="h-4 w-2/3 rounded bg-amber-200 mb-4" />

          {/* Lines skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-amber-100" />
            <div className="h-3 w-5/6 rounded bg-amber-100" />
            <div className="h-3 w-4/6 rounded bg-amber-100" />
          </div>

          {/* Footer buttons skeleton */}
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 rounded bg-amber-200" />
            <div className="h-6 w-16 rounded bg-amber-200" />
          </div>
        </div>
      ))}
    </div>
  )
}