import { useSyncExternalStore } from "react";
import type { StatusPrivacy } from "@/lib/statuses";

/**
 * The audience newly posted statuses default to. This is a device preference:
 * the audience that actually protects a status is stored with the status row
 * itself and enforced by the backend.
 */
const KEY = "tian.status.privacy.v2";
const DEFAULT: StatusPrivacy = "contacts";

let value: StatusPrivacy | null = null;
const listeners = new Set<() => void>();

function read(): StatusPrivacy {
  if (value) return value;
  if (typeof window === "undefined") return DEFAULT;
  const raw = window.localStorage.getItem(KEY);
  value = raw === "everyone" || raw === "contacts" || raw === "verified" ? raw : DEFAULT;
  return value;
}

export function setDefaultStatusPrivacy(next: StatusPrivacy) {
  value = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
  listeners.forEach((l) => l());
}

export function useDefaultStatusPrivacy(): StatusPrivacy {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => DEFAULT,
  );
}
