import { Link } from "@tanstack/react-router";
import { StatusRing } from "@/components/status/status-ring";
import { UsernameBadge } from "@/components/shared/username-badge";
import { formatChatStamp } from "@/lib/chat-format";
import { backgroundClass, type Status } from "@/lib/status-data";
import type { Person } from "@/lib/people-data";

/** One "Recent update" row: identity, timestamp and a media preview. */
export function StatusCard({
  status,
  author,
  viewed,
  index = 0,
}: {
  status: Status;
  author: Person;
  viewed: boolean;
  index?: number;
}) {
  const first = status.items[0];
  const preview = status.items.find((i) => i.src);

  return (
    <li
      className="animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Link
        to="/status/$statusId"
        params={{ statusId: status.id }}
        className="flex min-h-[72px] items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <StatusRing name={author.name} viewed={viewed} size="lg" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
            {author.name}
          </span>
          <UsernameBadge username={author.username} verified={author.verified} />
          <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">
            {formatChatStamp(status.createdAt)} · {status.items.length}{" "}
            {status.items.length === 1 ? "update" : "updates"}
          </span>
        </span>
        {preview?.src ? (
          <img
            src={preview.src}
            alt=""
            loading="lazy"
            className="size-14 shrink-0 rounded-2xl object-cover sm:size-16"
          />
        ) : (
          <span
            className={`grid size-14 shrink-0 place-items-center rounded-2xl px-2 text-center text-[10px] font-bold sm:size-16 ${backgroundClass(first?.background)}`}
          >
            {(first?.caption ?? "").slice(0, 24)}
          </span>
        )}
      </Link>
    </li>
  );
}
