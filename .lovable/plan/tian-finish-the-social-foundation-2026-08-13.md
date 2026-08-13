# TIAN — Finish the Social Foundation

Consolidation pass on top of what already exists. No redesign: same navy/white/green/gold tokens, same components, same localStorage + `useSyncExternalStore` stores.

## Already in place (verified)

- Shared people directory (`src/lib/people-data.ts`) with username rules and lookup, re-exported by chat data.
- Shared components: `UsernameBadge`, `PersonAvatar`, `ParticipantSearch`, `ParticipantCard`, `ContactRow`, `AddContactButton`.
- Routes: `/contacts`, `/u/$username`, `/status`, `/status/new`, `/status/$statusId`.
- Stores: `contacts-store.ts`, `status-store.ts` (privacy rule + enforcement helper), `chat-store.ts`.

## Remaining gaps to close

1. **Status privacy in Settings** — Settings only has "Who can message me?". Add a matching "Who can view my Status?" card (Everyone / My Contacts / Verified Award Members / Nobody) using the existing `ProfileCard` + option-row pattern and `setStatusPrivacy`. The feed already enforces the value.
2. **Share my username on** `/profile` — add a "My TIAN Username" card showing `@username` with a "Share My Username" button (Web Share API, clipboard fallback, toast). Share text: `Add me on TIAN: @username`.
3. **Community ↔ identity linkage** — post author blocks and member cards currently render a plain name/handle. Resolve the author through the shared directory, render `PersonAvatar` + name + `UsernameBadge` (+ country/role where already available), and make both link to `/u/$username`. Layout, spacing and card styling stay exactly as they are.
4. **Navigation to Contacts** — the bottom nav keeps its five tabs; add a visible Contacts entry point from the Chats screen header and the Profile quick actions so `/contacts` is reachable without typing a URL.
5. **Find People polish** — confirm blocked participants are excluded from results everywhere (Find People tab and `/chats/new`) and that each result opens `/u/$username`.

## Cross-module flows to verify end to end

- Find People → search @username → `/u/$username` → Add Contact → `/contacts`
- Contacts → Message → `/chats/$chatId` → send → reload → message persists
- Create Status → publish → My Status → viewer → Reply → chat conversation
- Status privacy switched across all four options actually changes the feed
- Community → post → author → profile → Add Contact → Message → chat

All messaging goes through the existing chat store; no second messaging path is introduced.

## Responsive + accessibility sweep

One component tree, Tailwind breakpoints only. Screenshot and inspect 320, 360, 375, 390, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1600 and 1920 for overflow, clipping, overlapping controls, broken bottom nav, stretched media and a broken status viewer. Check 44px targets, focus rings, aria-labels on icon-only buttons, labelled search fields, and `aria-pressed` on toggles. Fix anything found.

## Verification

Typecheck, production build, Playwright runs of each journey above with screenshots, and a console-error check on every visited route.

## Out of scope

Opportunities, Award Centres, Journeys, music, stickers, notifications, events, jobs, AI, payments, group chats, backend, push.

## Important implementation rule

&nbsp;

Before changing anything, inspect the existing implementation and preserve all functionality that is already verified above.

&nbsp;

Do not recreate existing stores, components, routes, or data structures.

&nbsp;

For every gap:

1. Reuse the existing component/store pattern.

2. Make the smallest necessary change.

3. Do not alter existing visual styling unless required for consistency.

4. Do not introduce mock data that conflicts with the shared people directory.

5. Do not add new dependencies unless absolutely necessary.

&nbsp;

After implementation, verify that existing Chat, Community, Profile and Status functionality still works exactly as before.