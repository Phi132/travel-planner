export function PlaceCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-1/3 rounded-full bg-muted animate-pulse mt-1" />
      </div>
    </div>
  );
}
