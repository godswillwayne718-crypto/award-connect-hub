import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { UsernameBadge } from "@/components/shared/username-badge";
import type { Person } from "@/lib/people-data";

/**
 * Directory result card. Deliberately shows Award context only — never email
 * addresses or phone numbers.
 */
export function ParticipantCard({
  person,
  actions,
  index = 0,
}: {
  person: Person;
  /** Trailing action(s): Add Contact, Start Chat, … */
  actions?: ReactNode;
  index?: number;
}) {
  return (
    <li
      className="animate-fade-up rounded-3xl border border-border bg-card p-3.5 shadow-soft"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="flex items-center gap-3">
        <Link
          to="/u/$username"
          params={{ username: person.username }}
          aria-label={`View @${person.username}'s profile`}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <PersonAvatar name={person.name} online={person.online} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to="/u/$username"
            params={{ username: person.username }}
            className="block min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
                {person.name}
              </span>
            </span>
            <UsernameBadge username={person.username} verified={person.verified} />
          </Link>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {person.country}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
          {person.role}
        </span>
        {person.level ? (
          <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
            {person.level}
          </span>
        ) : null}
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {person.verified ? "Verified" : "Unverified"}
        </span>
        {actions ? <div className="ml-auto flex items-center gap-1.5">{actions}</div> : null}
      </div>
    </li>
  );
}
