import { useSyncExternalStore } from "react";

/**
 * Lightweight client-side store for the onboarding flow.
 * Swap the persistence layer for Lovable Cloud later without touching screens.
 */
export type TianRole =
  | "participant"
  | "award-leader"
  | "assessor"
  | "alumni"
  | "centre"
  | "university";

export type AwardLevel = "bronze" | "silver" | "gold" | "completed" | "none";

export interface TianProfile {
  fullName: string;
  username: string;
  email: string;
  country: string;
  role: TianRole | null;
  level: AwardLevel | null;
  centre: string;
  headline: string;
  bio: string;
  interests: string[];
}

const STORAGE_KEY = "tian.profile.v1";

const empty: TianProfile = {
  fullName: "",
  username: "",
  email: "",
  country: "",
  role: null,
  level: null,
  centre: "",
  headline: "",
  bio: "",
  interests: [],
};

let state: TianProfile = empty;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...empty, ...(JSON.parse(raw) as Partial<TianProfile>) };
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function updateProfile(patch: Partial<TianProfile>) {
  hydrate();
  state = { ...state, ...patch };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  emit();
}

export function useProfile(): TianProfile {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => {
      hydrate();
      return state;
    },
    () => empty,
  );
}

export const ROLES: { value: TianRole; label: string; description: string }[] = [
  { value: "participant", label: "Participant", description: "Currently doing my Award" },
  { value: "award-leader", label: "Award Leader", description: "I guide and support participants" },
  { value: "assessor", label: "Assessor", description: "I assess Adventurous Journeys" },
  { value: "alumni", label: "Alumni", description: "I've completed my Award" },
  { value: "centre", label: "Award Centre", description: "Representing a licensed centre" },
  { value: "university", label: "University", description: "Recognising the Award" },
];

export const LEVELS: { value: AwardLevel; label: string }[] = [
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "completed", label: "Completed" },
  { value: "none", label: "Not applicable" },
];

export const INTERESTS = [
  "Adventurous Journey",
  "Volunteering",
  "Physical Recreation",
  "Skills",
  "Residential Project",
  "Leadership",
  "Sustainability",
  "Mentoring",
  "Scholarships",
  "Global Exchange",
];
