import { Link } from "@tanstack/react-router";
import { Check, Plus, Users } from "lucide-react";
import { formatMembers, type Community } from "@/lib/community-data";
import { toggleJoin, useJoined } from "@/lib/community-store";
import { cn } from "@/lib/utils";

function JoinButton({ id, className }: { id: string; className?: string }) {
  const joined = useJoined().includes(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleJoin(id);
      }}
      aria-pressed={joined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-2 text-[12px] font-bold transition-all duration-200 active:scale-95",
        joined
          ? "bg-accent-soft text-accent"
          : "bg-primary text-primary-foreground hover:brightness-110",
        className,
      )}
    >
      {joined ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
      {joined ? "Joined" : "Join"}
    </button>
  );
}

/** Featured card: cover image, overlapping logo, description and join action. */
export function CommunityCard({
  community,
  style,
}: {
  community: Community;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      to="/community/$communityId"
      params={{ communityId: community.id }}
      style={style}
      className="animate-fade-up block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-200 hover:shadow-lift active:scale-[0.99]"
    >
      <div className="relative h-28 bg-navy-gradient">
        <img
          src={community.cover}
          alt=""
          loading="lazy"
          width={1200}
          height={512}
          className="size-full object-cover"
        />
        <span className="absolute left-4 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary backdrop-blur">
          {community.category}
        </span>
      </div>
      <div className="relative px-4 pb-4">
        <span className="absolute -top-7 grid size-14 place-items-center rounded-2xl bg-navy-deep font-display text-base font-extrabold text-primary-foreground ring-4 ring-card">
          {community.logoInitials}
        </span>
        <div className="flex items-start justify-between gap-3 pl-[4.25rem] pt-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
              {community.name}
            </h3>
            <p className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
              <Users className="size-3.5" />
              {formatMembers(community.members)}
            </p>
          </div>
          <JoinButton id={community.id} className="mt-1" />
        </div>
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {community.description}
        </p>
      </div>
    </Link>
  );
}

/** Compact row used for joined communities. */
export function CommunityRow({
  community,
  style,
}: {
  community: Community;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      to="/community/$communityId"
      params={{ communityId: community.id }}
      style={style}
      className="animate-fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-all duration-200 hover:shadow-lift active:scale-[0.99]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
        {community.logoInitials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-foreground">
          {community.name}
        </span>
        <span className="block truncate text-[12px] text-muted-foreground">
          {community.category} · {formatMembers(community.members)}
        </span>
      </span>
      <JoinButton id={community.id} />
    </Link>
  );
}

export { JoinButton };
