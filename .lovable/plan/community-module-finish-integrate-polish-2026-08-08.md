# Community Module — Finish, Integrate, Polish

Consolidation pass over the existing Community module. No new features, no backend, no changes to onboarding, Home, Profile, Settings, or design tokens.

## 1. Data depth

`src/lib/community-data.ts` currently has 6 communities, 4 posts, and generated members. Extend it (same typed shapes, still mock):

- Add a "Technology & Innovation" community and align names with the requested set: Leadership & Personal Development, Award Expeditions, DofE Alumni Network, University & Scholarships, Sustainability & Volunteering, Award Centres, Technology & Innovation. Add a matching `Technology` category chip.
- 3–5 posts per community (mix of text, image, poll) with realistic authors, roles, countries and relative times, so every community feed has content.
- Members become per-community lists (hand-written names, roles, countries, Award levels) instead of one shared generated array; each community also gets 3–5 rules and 2–3 moderators.
- Keep all data typed and exported through the same helpers (`getCommunity`, `postsFor`, plus a new `membersFor`) so a backend swap stays a one-file change.

## 2. Interaction state

Extend `src/lib/community-store.ts` (same localStorage/useSyncExternalStore pattern) to persist:

- joined communities (already there)
- per-post reaction choice (like / celebrate / support)
- per-post poll selection
- locally created posts, so publishing from Create Post shows the new post at the top of the target community's feed

Comment and Share buttons stay frontend-only: Comment toggles a pressed state with a "coming soon" toast, Share copies a link via the Web Share API with a toast fallback — matching the Profile screen's existing share behaviour.

## 3. Component clean-up

- `CommunityCard` / `CommunityRow`: single shared card body, consistent cover ratio, line-clamped description, member count formatting shared in one helper.
- `PostCard`: extract the avatar chip into a shared `Avatar` piece used by PostCard, MemberCard, moderators and the composer row (removes four copies of the same initials circle).
- `ReactionBar`: driven by store state rather than local state, 44px minimum touch targets, `aria-pressed` on each action.
- `MemberCard`, `CategoryChips`, `SearchField`, `SectionHeading`, `CommunityTabs`: alignment/typography pass, keyboard-focus rings, chips get `role="tablist"`-style semantics, tabs get `aria-current`.
- New `EmptyState` component in `src/components/community/` used everywhere below.

## 4. Empty and loading states

Polished empty states for: no communities match search/category, no joined communities (with a prompt to browse featured), no posts in a community, no members match search, no search results on the feed. Each uses the shared `EmptyState` (icon, title, one line of guidance, optional action).

Skeleton placeholders for the feed, post list and member list, shown briefly on route entry so navigation never flashes bare.

## 5. Routes and navigation

Verify and fix the full journey: Feed → Community → Posts → Members → About → Create Post → Publish → back to the community.

- Every leaf route (`community.index`, `$communityId.index`, `members`, `about`, `create-post`) gets its own `head()` metadata with distinct title/description/og tags.
- `$communityId` handles an unknown id with `notFound()` plus a `notFoundComponent`, instead of the current silent `return null`.
- Create Post validates non-empty text and a chosen community, disables Publish until valid, shows a success toast, and navigates back to the target community feed.
- Back buttons and the bottom nav keep working from every Community screen.

## 6. Accessibility and responsiveness

Touch targets ≥44px, labels on both search inputs and every composer field, `aria-label` on icon-only buttons, visible focus rings, `h-dvh` where full-height is used, horizontal scroll containers not clipping content, and a wider max-width layout for tablet/desktop within the existing MobileShell frame.

## 7. Verification

Drive the whole journey in a headless browser at desktop and mobile widths, capture screenshots of each screen and each empty state, and confirm no console errors before reporting done.

## Out of scope

Messaging, notifications, events, hubs, jobs, AI, payments, admin, and any backend or database work.
