import type { Profile } from "@/lib/directory";

/**
 * Presentation helpers for a real TIAN identity.
 * One person = one auth user id = one profile row = one username.
 */

export const ROLE_LABEL: Record<string, string> = {
  participant: "Participant",
  "award-leader": "Award Leader",
  assessor: "Assessor",
  alumni: "Alumni",
  centre: "Award Centre",
  university: "University partner",
};

export const LEVEL_LABEL: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  completed: "Completed",
  none: "",
};

export function roleLabel(role: string | null | undefined): string {
  if (!role) return "Award member";
  return ROLE_LABEL[role] ?? role;
}

export function levelLabel(level: string | null | undefined): string {
  if (!level) return "";
  return LEVEL_LABEL[level] ?? level;
}

export function nameOf(profile: Pick<Profile, "full_name" | "username">): string {
  return profile.full_name.trim() || `@${profile.username}`;
}

/** "Online" or a human "last seen" line, from the profile row only. */
export function presenceLabel(profile: Pick<Profile, "online" | "last_seen_at">): string {
  if (profile.online) return "Online";
  const then = new Date(profile.last_seen_at).getTime();
  if (Number.isNaN(then)) return "Offline";
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `Last seen ${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Last seen ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Last seen ${days}d ago`;
}

/** True once the member has filled in enough to be useful in the directory. */
export function profileComplete(profile: Profile | null): boolean {
  return Boolean(profile && profile.username && profile.country.trim() && profile.role);
}
