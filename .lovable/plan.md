# TIAN — Username, Contacts, Status & Responsive Polish

Extends the existing app. No redesign of onboarding, Home, Profile, Settings, Chat or Community visuals; same navy/white/green/gold tokens, same localStorage + `useSyncExternalStore` architecture.

## 1. @username identity

- Shared participant directory: promote the chat mock people into a single `src/lib/people-data.ts` (re-exported by `chat-data.ts` so nothing breaks), merged with community members so the same person appears everywhere with name, @username, country, Award role, level, verification, online state.
- `UsernameBadge` component (always renders `@name`, truncates safely, optional verified tick).
- Username rules helper: 3–30 chars, letters/numbers/underscore, case-insensitive lookup, uniqueness check across mock data.
- Never render emails, phone numbers or any private contact data.

## 2. Find People + shared components

New `src/components/shared/`: `UsernameBadge`, `ParticipantSearch`, `ParticipantCard`, `ContactRow`, `AddContactButton`. Chat's existing participant search/card are moved here and re-exported so `/chats/new` keeps working unchanged.

Search matches name or @username, case-insensitive, instant. Results show avatar, name, @username, country, role, level, verification, and Add Contact.

## 3. Contacts

- `src/lib/contacts-store.ts` — localStorage store with `addContact`, `removeContact`, `isContact`, `searchContacts`, plus `useContacts()` hook.
- Route `/contacts` — "My Contacts": search field, contact rows (avatar, name, @username, country, level, online dot) with View Profile, Message, Remove Contact.
- Empty state: "No contacts yet" with the copy given and a "Find People" button.
- Blocked people cannot be added and are hidden from Find People results.

## 4. Participant profile

New route `/u/$username` — a read-only profile reusing the existing profile card components (header, about, interests, communities). Actions: Add to Contacts / Added to Contacts, and Message (opens or creates the chat, then navigates to `/chats/$chatId`). The user's own `/profile` screen is untouched apart from item 5.

## 5. Share my username

On `/profile`, a "My TIAN Username" card showing `@username` and a "Share My Username" button using Web Share API with clipboard fallback and toast. Share text: `Add me on TIAN: @username`.

## 6–9. Status

- `src/lib/status-data.ts` (mock recent updates) + `src/lib/status-store.ts` (my statuses, viewed set, privacy setting).
- Data model supports multiple media items per status: `{ id, authorId, items: [{ kind: text|photo|video, src, caption, background }], createdAt, expiresAt }`.
- `/status` feed: "My Status" row (avatar with ring, latest timestamp, tap to add) and "Recent Updates" with viewed/unviewed rings, name, @username, timestamp, media thumbnail.
- `/status/new` composer: text status (styled background, character limit), photo and video selection via local file picker with preview and caption; video preview has play/pause and mute/unmute. Media stays in-memory/object URLs — no cloud storage.
- `/status/$statusId` viewer: `h-dvh` full screen on phones, centered with margins on tablet, centered with max dimensions on desktop. Controls: close, previous, next, play/pause, mute/unmute, progress bars, `object-contain` so media is never stretched. Reply field sends into the existing chat store and navigates to the conversation.
- Privacy card in Settings: "Who can view my Status?" — Everyone / My Contacts / Verified Award Members / Nobody, persisted locally and actually enforced by the feed filter (blocked users always excluded).
- Tapping a status author opens `/u/$username`.

## 10–13. Community linkage

- Post author block and member cards gain @username (and role/country where already available), and become links to `/u/$username`. Layout and styling stay as they are.
- Verify community search, category filtering, joined and featured sections still behave across breakpoints.

## Responsive strategy

One component tree, Tailwind breakpoints only.

- Phones: single column, full-width cards, bottom nav, 44px targets, safe-area padding, no horizontal scroll.
- Tablets (`md:`): wider content column, two-column layouts for Contacts (list + detail/placeholder) and Status feed grid, larger media previews.
- Desktop (`lg:`/`xl:`): centered max-width container, community card grid, chat list + conversation side-by-side, centered status viewer with max dimensions.
- The `MobileShell` gains an optional wider `max-w` variant used by the new/upgraded screens so existing screens are unaffected.

## Verification

Typecheck, production build, and Playwright runs of each journey (username search → profile → add contact → contacts; contacts → message → chat; create status → view → reply → chat; privacy switching; community post author → profile → contact → chat) with screenshots at 320, 360, 375, 390, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1600 and 1920 widths, checking for overflow, clipping, overlap and console errors.

## Out of scope

Music, notifications, events, jobs, AI, payments, group chats, phone contacts, backend, push, cloud media storage.
