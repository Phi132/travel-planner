export function TripCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden animate-pulse">
      <div className="h-32 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-muted" />
        <div className="h-3 w-1/2 rounded-full bg-muted" />
        <div className="h-3 w-2/5 rounded-full bg-muted" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 rounded-2xl bg-muted" />
          <div className="h-9 w-9 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
