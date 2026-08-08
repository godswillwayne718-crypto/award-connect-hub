import { useSyncExternalStore } from "react";
import { DEFAULT_JOINED, type CommunityPost } from "@/lib/community-data";

/**
 * Client-side community state (membership, reactions, poll votes and locally
 * created posts). Persisted to localStorage; swap for Lovable Cloud later.
 */
const STORAGE_KEY = "tian.communities.v2";

export type ReactionKey = "like" | "celebrate" | "support";

interface CommunityState {
  joined: string[];
  reactions: Record<string, ReactionKey>;
  polls: Record<string, string>;
  drafts: CommunityPost[];
}

const EMPTY: CommunityState = {
  joined: DEFAULT_JOINED,
  reactions: {},
  polls: {},
  drafts: [],
};

let state: CommunityState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<CommunityState>) };
  } catch {
    /* ignore */
  }
}

function commit(next: CommunityState) {
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

function useStore<T>(select: (s: CommunityState) => T, serverValue: T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return select(state);
    },
    () => serverValue,
  );
}

/* --- membership --- */

export function toggleJoin(id: string) {
  hydrate();
  const joined = state.joined.includes(id)
    ? state.joined.filter((c) => c !== id)
    : [...state.joined, id];
  commit({ ...state, joined });
}

export function useJoined(): string[] {
  return useStore((s) => s.joined, DEFAULT_JOINED);
}

export function useIsJoined(id: string): boolean {
  return useStore((s) => s.joined.includes(id), DEFAULT_JOINED.includes(id));
}

/* --- reactions --- */

export function setReaction(postId: string, key: ReactionKey) {
  hydrate();
  const reactions = { ...state.reactions };
  if (reactions[postId] === key) delete reactions[postId];
  else reactions[postId] = key;
  commit({ ...state, reactions });
}

export function useReaction(postId: string): ReactionKey | null {
  return useStore((s) => s.reactions[postId] ?? null, null);
}

/* --- polls --- */

export function setPollVote(postId: string, optionId: string) {
  hydrate();
  const polls = { ...state.polls };
  if (polls[postId] === optionId) delete polls[postId];
  else polls[postId] = optionId;
  commit({ ...state, polls });
}

export function usePollVote(postId: string): string | null {
  return useStore((s) => s.polls[postId] ?? null, null);
}

/* --- locally created posts --- */

export function addDraftPost(post: CommunityPost) {
  hydrate();
  commit({ ...state, drafts: [post, ...state.drafts] });
}

const NO_DRAFTS: CommunityPost[] = [];

export function useDraftPosts(communityId: string): CommunityPost[] {
  return useStore((s) => {
    const own = s.drafts.filter((d) => d.communityId === communityId);
    return own.length ? own : NO_DRAFTS;
  }, NO_DRAFTS);
}

/** Placeholder permission flag — real role checks arrive with the backend. */
export function useCanCreateCommunity() {
  return true;
}
