import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

export function CommunityListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-border bg-card">
          <Block className="h-28 rounded-none" />
          <div className="space-y-2 p-4">
            <Block className="h-4 w-2/3" />
            <Block className="h-3 w-1/3" />
            <Block className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Block className="size-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Block className="h-3.5 w-1/3" />
              <Block className="h-3 w-1/4" />
            </div>
          </div>
          <Block className="h-3 w-full" />
          <Block className="h-3 w-4/5" />
          <Block className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function MemberListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
        >
          <Block className="size-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Block className="h-3.5 w-1/3" />
            <Block className="h-3 w-1/4" />
            <Block className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
