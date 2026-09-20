/**
 * Generic page-level loading skeleton for dashboard sub-pages.
 * Shows an animated pulsing placeholder while the page chunk is loading.
 */
export default function PageLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page header placeholder */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-xl bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-muted/60 animate-pulse" />
      </div>

      {/* Content cards placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-muted animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      {/* Main content placeholder */}
      <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      <div className="h-48 rounded-2xl bg-muted/60 animate-pulse" />
    </div>
  );
}
