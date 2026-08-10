import { useSyncExternalStore } from "react";
import {
  ME,
  SEED_CHATS,
  findParticipant,
  type Chat,
  type ChatParticipant,
  type Message,
} from "@/lib/chat-data";

/**
 * Client-side chat state (conversations, messages, safety flags and privacy).
 * Persisted to localStorage behind a small action API so it can be swapped for
 * a realtime backend without changing any component.
 */
const STORAGE_KEY = "tian.chats.v1";

export type MessagePrivacy = "everyone" | "connections" | "verified" | "nobody";

export interface ChatState {
  chats: Chat[];
  blocked: string[];
  restricted: string[];
  reported: string[];
  privacy: MessagePrivacy;
}

const EMPTY: ChatState = {
  chats: SEED_CHATS,
  blocked: [],
  restricted: [],
  reported: [],
  privacy: "everyone",
};

let state: ChatState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<ChatState>) };
  } catch {
    /* ignore */
  }
}

function commit(next: ChatState) {
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

function useStore<T>(select: (s: ChatState) => T, serverValue: T): T {
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

/** Newest activity first; brand-new empty chats sort by creation time. */
function lastActivity(chat: Chat) {
  const last = chat.messages[chat.messages.length - 1];
  return new Date(last ? last.sentAt : chat.createdAt).getTime();
}

export function sortChats(chats: Chat[]) {
  return [...chats].sort((a, b) => lastActivity(b) - lastActivity(a));
}

export function lastMessage(chat: Chat): Message | undefined {
  return chat.messages[chat.messages.length - 1];
}

/* ---------------------------------------------------------------- actions */

export function startChat(participantId: string): string {
  hydrate();
  const existing = state.chats.find((c) => c.participantId === participantId);
  if (existing) return existing.id;
  const chat: Chat = {
    id: newId("c"),
    participantId,
    messages: [],
    unread: 0,
    createdAt: new Date().toISOString(),
  };
  commit({ ...state, chats: [chat, ...state.chats] });
  return chat.id;
}

export function sendMessage(chatId: string, body: string) {
  hydrate();
  const trimmed = body.trim();
  if (!trimmed) return;
  const message: Message = {
    id: newId("m"),
    chatId,
    authorId: ME,
    body: trimmed,
    sentAt: new Date().toISOString(),
    status: "delivered",
  };
  commit({
    ...state,
    chats: state.chats.map((c) =>
      c.id === chatId ? { ...c, messages: [...c.messages, message] } : c,
    ),
  });
}

export function markRead(chatId: string) {
  hydrate();
  if (!state.chats.some((c) => c.id === chatId && c.unread > 0)) return;
  commit({
    ...state,
    chats: state.chats.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)),
  });
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

export function toggleBlocked(participantId: string) {
  hydrate();
  commit({ ...state, blocked: toggle(state.blocked, participantId) });
}

export function toggleRestricted(participantId: string) {
  hydrate();
  commit({ ...state, restricted: toggle(state.restricted, participantId) });
}

export function reportParticipant(participantId: string) {
  hydrate();
  if (state.reported.includes(participantId)) return;
  commit({ ...state, reported: [...state.reported, participantId] });
}

export function setMessagePrivacy(privacy: MessagePrivacy) {
  hydrate();
  commit({ ...state, privacy });
}

/* ------------------------------------------------------------------ hooks */

export function useChats(): Chat[] {
  return useStore((s) => s.chats, EMPTY.chats);
}

export function useChat(chatId: string): Chat | undefined {
  return useStore(
    (s) => s.chats.find((c) => c.id === chatId),
    EMPTY.chats.find((c) => c.id === chatId),
  );
}

export function useUnreadTotal(): number {
  return useStore(
    (s) => s.chats.reduce((n, c) => n + c.unread, 0),
    EMPTY.chats.reduce((n, c) => n + c.unread, 0),
  );
}

export function useIsBlocked(participantId: string): boolean {
  return useStore((s) => s.blocked.includes(participantId), false);
}

export function useIsRestricted(participantId: string): boolean {
  return useStore((s) => s.restricted.includes(participantId), false);
}

export function useMessagePrivacy(): MessagePrivacy {
  return useStore((s) => s.privacy, EMPTY.privacy);
}

export function participantOf(chat: Chat): ChatParticipant | undefined {
  return findParticipant(chat.participantId);
}
