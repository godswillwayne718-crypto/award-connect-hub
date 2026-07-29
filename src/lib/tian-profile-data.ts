import { LEVELS, ROLES, type AwardLevel, type TianProfile, type TianRole } from "@/lib/tian-store";

/** Placeholder Award records — swap for Lovable Cloud data later. */
export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  level: "bronze" | "silver" | "gold";
  verified: boolean;
}

export interface Community {
  id: string;
  name: string;
  members: string;
  category: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "gold-aj",
    title: "Gold Adventurous Journey",
    issuer: "Award Centre · Nairobi",
    date: "Mar 2025",
    level: "gold",
    verified: true,
  },
  {
    id: "silver-cert",
    title: "Silver Award Certificate",
    issuer: "The Duke of Edinburgh's International Award",
    date: "Nov 2023",
    level: "silver",
    verified: true,
  },
  {
    id: "bronze-cert",
    title: "Bronze Award Certificate",
    issuer: "The Duke of Edinburgh's International Award",
    date: "Jun 2022",
    level: "bronze",
    verified: false,
  },
];

export const COMMUNITIES: Community[] = [
  { id: "leaders", name: "Award Leaders Global", members: "12.4k members", category: "Leadership" },
  { id: "aj", name: "Adventurous Journey Hub", members: "8.1k members", category: "Expeditions" },
  { id: "alumni", name: "Alumni Network", members: "21.7k members", category: "Alumni" },
  { id: "scholar", name: "Scholarships & Universities", members: "5.3k members", category: "Study" },
];

export const DEFAULT_INTERESTS = [
  "Basketball",
  "Graphic Design",
  "Leadership",
  "Volunteering",
  "Hiking",
  "Computer Science",
];

export function roleLabel(role: TianRole | null) {
  return ROLES.find((r) => r.value === role)?.label ?? "Award Member";
}

export function levelLabel(level: AwardLevel | null) {
  if (!level || level === "none") return null;
  return LEVELS.find((l) => l.value === level)?.label ?? null;
}

export function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T"
  );
}

export function usernameOf(profile: TianProfile) {
  if (profile.username) return profile.username.replace(/^@/, "");
  const base = profile.fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  return base || "tianmember";
}
