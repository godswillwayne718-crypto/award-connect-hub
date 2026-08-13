import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { UsernameBadge } from "@/components/shared/username-badge";
import { findPersonByUsername, normalizeUsername } from "@/lib/people-data";
import type { CommunityMember } from "@/lib/community-data";

export function MemberCard({
  member,
  style,
}: {
  member: CommunityMember;
  style?: React.CSSProperties;
}) {
  const handle = normalizeUsername(member.username);
  const person = findPersonByUsername(handle);

  return (
    <li
      style={style}
      className="animate-fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Link
        to="/u/$username"
        params={{ username: handle }}
        aria-label={`View @${handle}'s profile`}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <Avatar name={member.name} size="lg" tone="navy" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to="/u/$username"
          params={{ username: handle }}
          className="block min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <span className="block truncate text-[14px] font-bold text-foreground">{member.name}</span>
          <UsernameBadge username={handle} verified={person?.verified} tone="muted" />
        </Link>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {member.role}
          </span>
          {member.level ? (
            <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
              {member.level}
            </span>
          ) : null}
          <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{member.country}</span>
          </span>
        </div>
      </div>
    </li>
  );
}
