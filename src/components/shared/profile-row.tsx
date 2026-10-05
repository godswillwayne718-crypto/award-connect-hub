import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { nameOf, roleLabel } from "@/lib/identity";
import type { Profile } from "@/lib/directory";

/** One real TIAN member from the shared directory, with optional actions. */
export function ProfileRow({ profile, actions }: { profile: Profile; actions?: ReactNode }) {
  const meta = [roleLabel(profile.role), profile.country].filter(Boolean).join(" · ");
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <Link
        to="/u/$username"
        params={{ username: profile.username }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <PersonAvatar name={nameOf(profile)} online={profile.online} size="md" />
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-bold text-foreground">{nameOf(profile)}</span>
          <span className="block truncate text-[12px] font-semibold text-primary">@{profile.username}</span>
          {meta ? <span className="block truncate text-[11.5px] text-muted-foreground">{meta}</span> : null}
        </span>
      </Link>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </li>
  );
}
