import { MapPin } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import type { CommunityMember } from "@/lib/community-data";

export function MemberCard({
  member,
  style,
}: {
  member: CommunityMember;
  style?: React.CSSProperties;
}) {
  return (
    <li
      style={style}
      className="animate-fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Avatar name={member.name} size="lg" tone="navy" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold text-foreground">{member.name}</p>
        <p className="truncate text-[12px] text-muted-foreground">@{member.username}</p>
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
