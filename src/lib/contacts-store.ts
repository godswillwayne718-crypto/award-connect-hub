import { useSyncExternalStore } from "react";
import { PEOPLE, findPerson, searchPeople, type Person } from "@/lib/people-data";

/**
 * TIAN contacts. Same localStorage + useSyncExternalStore architecture as the
 * chat and community stores, so a backend can replace the internals later
 * without touching the UI.
 */
const STORAGE_KEY = "tian.contacts.v1";

export interface ContactsState {
  /** Person ids, newest first. */
  ids: string[];
}

const EMPTY: ContactsState = { ids: ["p-alex", "p-maria"] };

let state: ContactsState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<ContactsState>) };
  } catch {
    /* ignore */
  }
}

function commit(next: ContactsState) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useStore<T>(select: (s: ContactsState) => T, serverValue: T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return select(state);
    },
    () => serverValue,
  );
}

/* ---------------------------------------------------------------- actions */

export function addContact(personId: string) {
  hydrate();
  if (state.ids.includes(personId)) return;
  commit({ ...state, ids: [personId, ...state.ids] });
}

export function removeContact(personId: string) {
  hydrate();
  if (!state.ids.includes(personId)) return;
  commit({ ...state, ids: state.ids.filter((id) => id !== personId) });
}

export function isContact(personId: string): boolean {
  hydrate();
  return state.ids.includes(personId);
}

export function contactIds(): string[] {
  hydrate();
  return state.ids;
}

/** Contacts filtered by name or @username. */
export function searchContacts(query: string, ids: string[] = contactIds()): Person[] {
  const people = ids.map(findPerson).filter((p): p is Person => Boolean(p));
  return searchPeople(query, people);
}

/* ------------------------------------------------------------------ hooks */

export function useContactIds(): string[] {
  return useStore((s) => s.ids, EMPTY.ids);
}

export function useContacts(): Person[] {
  const ids = useContactIds();
  return ids.map(findPerson).filter((p): p is Person => Boolean(p));
}

export function useIsContact(personId: string): boolean {
  return useStore((s) => s.ids.includes(personId), EMPTY.ids.includes(personId));
}

export function useContactCount(): number {
  return useStore((s) => s.ids.length, EMPTY.ids.length);
}

/** People who are not contacts yet — used by Find People suggestions. */
export function suggestedPeople(ids: string[]): Person[] {
  return PEOPLE.filter((p) => !ids.includes(p.id));
}
