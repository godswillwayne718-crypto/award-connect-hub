import { useSyncExternalStore } from "react";
import { SEED_STATUSES, type Status, type StatusItem } from "@/lib/status-data";
import { findPerson, type Person } from "@/lib/people-data";

/**
 * Status state: statuses I published, which updates I have viewed and who is
 * allowed to see my Status. localStorage backed, same pattern as chat.
 */
const STORAGE_KEY = "tian.status.v1";

export type StatusPrivacy = "everyone" | "contacts" | "verified" | "nobody";

export interface StatusState {
  mine: Status[];
  viewed: string[];
  privacy: StatusPrivacy;
}

export const ME = "me";

const EMPTY: StatusState = { mine: [], viewed: [], privacy: "everyone" };

let state: StatusState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<StatusState>) };
  } catch {
    /* ignore */
  }
}

/** Media is dropped from persistence when it would blow the storage quota. */
function persist(next: StatusState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    try {
      const lean: StatusState = {
        ...next,
        mine: next.mine.map((s) => ({
          ...s,
          items: s.items.map((i) => (i.src?.startsWith("data:") ? { ...i, src: undefined } : i)),
        })),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lean));
    } catch {
      /* ignore */
    }
  }
}

function commit(next: StatusState) {
  state = next;
  persist(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useStore<T>(select: (s: StatusState) => T, serverValue: T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return select(state);
    },
    () => serverValue,
  );
}

function newId(prefix: string) {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${rand}`;
}

/* ---------------------------------------------------------------- actions */

export function publishStatus(items: Omit<StatusItem, "id">[]): string | null {
  hydrate();
  if (items.length === 0) return null;
  const status: Status = {
    id: newId("s"),
    authorId: ME,
    createdAt: new Date().toISOString(),
    items: items.map((item, i) => ({ ...item, id: newId(`si${i}`) })),
  };
  commit({ ...state, mine: [status, ...state.mine] });
  return status.id;
}

export function deleteStatus(statusId: string) {
  hydrate();
  commit({ ...state, mine: state.mine.filter((s) => s.id !== statusId) });
}

export function markStatusViewed(statusId: string) {
  hydrate();
  if (state.viewed.includes(statusId)) return;
  commit({ ...state, viewed: [...state.viewed, statusId] });
}

export function setStatusPrivacy(privacy: StatusPrivacy) {
  hydrate();
  commit({ ...state, privacy });
}

/* ------------------------------------------------------------- visibility */

/**
 * Enforces the "Who can view my Status?" audience rule. The same rule governs
 * what the signed-in user can see in the feed and open in the viewer, so the
 * setting is observable end to end without a backend.
 */
export function canViewStatus(
  person: Person | undefined,
  opts: { privacy: StatusPrivacy; isContact: boolean; blocked: boolean },
): boolean {
  if (!person || opts.blocked) return false;
  switch (opts.privacy) {
    case "everyone":
      return true;
    case "contacts":
      return opts.isContact;
    case "verified":
      return person.verified;
    case "nobody":
      return false;
  }
}

export const PRIVACY_LABEL: Record<StatusPrivacy, string> = {
  everyone: "Everyone",
  contacts: "My Contacts",
  verified: "Verified Award Members",
  nobody: "Nobody",
};

/* ------------------------------------------------------------------ hooks */

export function useMyStatuses(): Status[] {
  return useStore((s) => s.mine, EMPTY.mine);
}

export function useStatusPrivacy(): StatusPrivacy {
  return useStore((s) => s.privacy, EMPTY.privacy);
}

export function useViewedIds(): string[] {
  return useStore((s) => s.viewed, EMPTY.viewed);
}

/** Seeded updates from other members, newest first. */
export function recentStatuses(): Status[] {
  return [...SEED_STATUSES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function findStatus(statusId: string, mine: Status[]): Status | undefined {
  return mine.find((s) => s.id === statusId) ?? SEED_STATUSES.find((s) => s.id === statusId);
}

export function authorOf(status: Status): Person | undefined {
  return status.authorId === ME ? undefined : findPerson(status.authorId);
}
