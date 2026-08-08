import { Link } from "@tanstack/react-router";
import { Check, Plus, Users } from "lucide-react";
import { formatMembers, type Community } from "@/lib/community-data";
import { toggleJoin, useIsJoined } from "@/lib/community-store";
import { cn } from "@/lib/utils";

const cardBase =
  "animate-fade-up block rounded-3xl border border-border bg-card shadow-soft transition-all duration-200 hover:shadow-lift active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

export function JoinButton({
  community,
  className,
}: {
  community: Community;
  className?: string;
}) {
  const joined = useIsJoined(community.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleJoin(community.id);
      }}
      aria-pressed={joined}
      aria-label={joined ? `Leave ${community.name}` : `Join ${community.name}`}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-4 text-[12.5px] font-bold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        joined
          ? "bg-accent-soft text-accent"
          : "bg-primary text-primary-foreground hover:brightness-110",
        className,
      )}
    >
      {joined ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Plus className="size-3.5" aria-hidden="true" />
      )}
      {joined ? "Joined" : "Join"}
    </button>
  );
}

function MemberCount({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
      <Users className="size-3.5" aria-hidden="true" />
      {formatMembers(n)}
    </span>
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
      className={cn(cardBase, "overflow-hidden")}
    >
      <div className="relative aspect-[16/6] bg-navy-gradient">
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
        <span
          aria-hidden="true"
          className="absolute -top-7 grid size-14 place-items-center rounded-2xl bg-navy-deep font-display text-base font-extrabold text-primary-foreground ring-4 ring-card"
        >
          {community.logoInitials}
        </span>
        <div className="flex items-start justify-between gap-3 pl-[4.25rem] pt-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-display text-[15px] font-extrabold leading-snug tracking-tight text-foreground">
              {community.name}
            </h3>
            <MemberCount n={community.members} />
          </div>
          <JoinButton community={community} />
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
      className={cn(cardBase, "flex items-center gap-3 p-3")}
    >
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft font-display text-[13px] font-extrabold text-primary"
      >
        {community.logoInitials}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[14px] font-bold text-foreground">{community.name}</h3>
        <MemberCount n={community.members} />
      </div>
      <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1.5 text-[11px] font-bold text-accent">
        Joined
      </span>
    </Link>
  );
}
