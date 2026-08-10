# TIAN — Chat Module MVP

A WhatsApp-simple, TIAN-premium messaging experience built entirely on local state, using the existing design tokens and components. No backend, sockets or push.

## Screens

**Chats inbox (`/chats`)** — replaces the placeholder. Sticky header with "Chats", total unread pill, search toggle and a New Chat button. Conversation rows show avatar (with online dot), full name + verified mark, @username, last message preview, relative timestamp and unread badge. Rows animate in on mount.

**Search** — inline search field filters by name, @username and last-message text as you type; no-results shows an EmptyState.

**New Chat (`/chats/new`)** — search TIAN participants by @username or name. Result cards show avatar, name, @username, country, Award role, Award level, verification — never email or phone — with a Start Chat button that creates (or opens) the conversation.

**Conversation (`/chats/$chatId`)** — full-height messaging layout (`h-dvh`, `min-h-0` scroll region) so the composer stays pinned and never covers messages. Header: back, avatar + online dot, name, @username, presence line, More menu. Message area: date separators, grouped sent/received bubbles, timestamps, delivered/read ticks on own messages, auto-scroll to newest, gentle entry animation.

**Composer** — auto-growing textarea (capped height), attachment and emoji buttons (each a "Coming soon" toast), Send disabled while empty, Enter sends / Shift+Enter newlines on desktop.

**Safety** — More menu with Block, Report, Restrict (local state + toast confirmation; blocked chats show a disabled composer banner). A "Who can message me?" setting is added to Settings with Everyone / My connections / Verified Award members / Nobody, persisted locally.

## Data & state

- `src/lib/chat-data.ts` — typed mock participants (Alex Johnson, @maria_award, @danieltech, @sarahleadership and a few more) and seed conversations with realistic message threads. No real personal data, no contact details.
- `src/lib/chat-store.ts` — `useSyncExternalStore` + localStorage store matching the existing `community-store` pattern. Typed `ChatParticipant`, `Message`, `Chat`. Actions: `sendMessage`, `openChat` (marks read), `startChat(participantId)`, `blockParticipant`, `reportParticipant`, `restrictParticipant`, `setMessagePrivacy`. Seeded threads merge with locally sent messages so a future backend can swap this module without UI changes.

## Components (`src/components/chat/`)

`ChatList`, `ChatRow`, `ChatHeader`, `MessageList`, `MessageBubble`, `MessageComposer`, `ParticipantSearch`, `ParticipantCard`, plus a thin `ChatEmptyState` wrapper over the existing community `EmptyState`. Reuses `AppScreen`, `MobileShell`, community `Avatar`, `Button`, `SearchField`, sonner toasts. Conversation route uses its own full-height shell (no bottom nav) so the keyboard behaves like a native chat.

## Navigation

Chats tab keeps highlighting on all `/chats/*` routes. Flow: Chats → New Chat → @username search → Start Chat → Conversation. The Profile screen's quick actions gain a Message action only if it fits the existing layout without redesign.

## Technical notes

- Routes: `src/routes/chats.tsx` becomes a layout (`<Outlet />`), with `chats.index.tsx`, `chats.new.tsx`, `chats.$chatId.tsx`; each leaf gets its own `head()` metadata.
- Timestamps formatted with a small local helper (today → time, this week → weekday, else date) to keep SSR/hydration stable; message ids via `crypto.randomUUID()` guarded for SSR.
- Accessibility: 44px touch targets, labelled icon buttons, `aria-live` on the message list, keyboard-operable rows and menus, visible focus rings.
- Verification: typecheck plus Playwright pass over inbox, search, new chat, sending/persistence, unread counts, empty states, safety menu, and 320/375/390/430/tablet/desktop widths with console checked.

## Out of scope

Real uploads, emoji picker, group chats, contacts management, notifications, backend.
