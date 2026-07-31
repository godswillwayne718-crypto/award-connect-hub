# Community Module

Extends TIAN with a five-screen Community experience — LinkedIn Groups meets Discord — reusing the existing navy/white/green/gold design system, rounded cards, and animation utilities. No onboarding, profile, or design-token changes.

## Screens

**Community Feed** (`/community`, replaces the current placeholder)
- Navy gradient header with title and search bar
- Horizontal category chips (Leadership, Expeditions, Alumni, Study, Sustainability, Centres)
- "Your communities" list of joined groups with quick access
- "Featured" carousel/grid of community cards (cover image, logo, name, member count, short description, Join button)
- "Create Community" button rendered behind a simple `canCreateCommunity` flag so it can be gated on real roles later

**Community Details** (`/community/$communityId`)
- Cover banner with back button, overlapping circular logo
- Name, category chip, member count, description
- Join / Joined toggle (local state, animated)
- Tabs: Posts | Members | About
- About tab holds Rules (numbered cards) and Moderators (avatar rows with role badges)

**Community Posts** (Posts tab + `/community/$communityId/posts` feed body)
- Post composer entry row ("Share something with the group…") opening Create Post
- PostCard supports three types: text, image, poll (poll bars are UI only, tapping shows selected state)
- Author avatar, name, role/country meta, time posted
- ReactionBar: Like, Celebrate, Support, Comment, Share with counts and tap animation

**Create Post** (`/community/create-post`)
- Auto-growing text area, community picker (dropdown of joined communities)
- Attachment row: Add image, Add file, Add poll (poll opens simple option inputs; placeholder only)
- Sticky Publish button, disabled until text entered; on publish shows a toast and returns to the feed

**Community Members** (`/community/$communityId/members`)
- Search field filtering by name
- MemberCard: avatar, name, @username, role badge, country, Award level chip

## Reusable components

New folder `src/components/community/`:
- `community-card.tsx` — cover + logo + meta + join action (compact and featured variants)
- `post-card.tsx` — renders text/image/poll bodies
- `reaction-bar.tsx` — Like / Celebrate / Support / Comment / Share
- `member-card.tsx`
- `category-chips.tsx`, `search-field.tsx`, `section-heading.tsx`
- `community-tabs.tsx`

Existing `AppScreen`, `MobileShell`, `ProfileCard`/`Tag`, button variants, and animation classes are reused as-is.

## Technical notes

- Routes: `community.tsx` becomes a layout rendering `<Outlet />`, with `community.index.tsx`, `community.$communityId.tsx` (layout), `community.$communityId.index.tsx` (posts), `community.$communityId.members.tsx`, `community.$communityId.about.tsx`, and `community.create-post.tsx`. Each leaf gets its own `head()` metadata.
- Mock data in `src/lib/community-data.ts` (communities, posts, members, rules, moderators) with typed interfaces, shaped so a Cloud backend can replace it later.
- Join state and reaction state kept in a small client store mirroring `tian-store.ts` patterns (localStorage-backed), no backend.
- Only Tailwind semantic tokens; images generated for community covers/logos.

## Out of scope

Messaging, notifications, real posting/persistence, permissions enforcement, and backend logic.
