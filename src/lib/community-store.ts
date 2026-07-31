import { useSyncExternalStore } from "react";
import { DEFAULT_JOINED } from "@/lib/community-data";

/** Client-side membership state. Swap for Lovable Cloud later. */
const STORAGE_KEY = "tian.communities.v1";

let joined: string[] = DEFAULT_JOINED;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) joined = JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(joined));
  } catch {
    /* ignore */
  }
}

export function toggleJoin(id: string) {
  hydrate();
  joined = joined.includes(id) ? joined.filter((c) => c !== id) : [...joined, id];
  persist();
  listeners.forEach((l) => l());
}

export function useJoined(): string[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => {
      hydrate();
      return joined;
    },
    () => DEFAULT_JOINED,
  );
}

/** Placeholder permission flag — real role checks arrive with the backend. */
export function useCanCreateCommunity() {
  return true;
}
