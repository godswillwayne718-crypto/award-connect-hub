# TIAN — Final Consolidation Pass

Most of this brief is already built and verified. No redesign, no new dependencies, same navy/white/green/gold tokens, same localStorage + `useSyncExternalStore` stores.

## Already in place (verified in code)

- Shared people directory (`src/lib/people-data.ts`) backing Chat, Community, Contacts, Status and Profiles; `UsernameBadge`, `PersonAvatar`, `ParticipantSearch`, `ParticipantCard`, `ContactRow`, `AddContactButton`.
- Routes: `/contacts`, `/u/$username`, `/status`, `/status/new`, `/status/$statusId`, plus the existing Chat and Community routes.
- Settings: "Who can message me?" and "Who can view my Status?" (Everyone / My Contacts / Verified Award Members / Nobody), enforced in the Status feed.
- Profile: "My TIAN Username" card with Web Share + clipboard fallback.
- Community post authors and member cards resolve through the shared directory and link to `/u/$username`.
- Chats header has a Contacts entry point; blocked participants are excluded from Find People results.

## Remaining work

1. **My Status row bug** — after publishing, the "My Status" row still routed to `/status/new` in the last check instead of opening the just-published status. Trace `useMyStatuses` / `recentStatuses` freshness and the 24-hour window filter, then fix so a freshly published status appears immediately and the row links to `/status/$statusId`.
2. **Responsive sweep** — one component tree, Tailwind breakpoints only. Screenshot and inspect 320, 360, 375, 390, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1600 and 1920 across Home, Community feed + post, Contacts, Find People, Profile, `/u/$username`, Chats inbox, conversation, Status feed, composer and viewer. Fix any horizontal overflow, clipping, overlapping controls, broken bottom nav, stretched media or broken viewer.
3. **Accessibility check** — 44px targets, visible focus rings, `aria-label` on icon-only buttons, labelled search fields, `aria-pressed` on toggles, `aria-live` on the message list. Fix what is missing; no visual redesign.
4. **Empty states** — confirm every listed surface (no contacts, no people found, no status updates, no community results, no posts, no members) uses the single shared `EmptyState`.

## Verification

Typecheck, production build, and Playwright runs with screenshots for: Find People → profile → Add Contact → Contacts; Contacts → Message → send → reload → persists; Create Status → publish → My Status → viewer → Reply → Chat; Status privacy across all four options; Community → post → author → profile → Add Contact → Message → Chat. Console-error check on every visited route.

## Out of scope

Opportunities, Award Centres, Journeys, music, stickers, notifications, events, jobs, AI, payments, group chats, backend, push.
