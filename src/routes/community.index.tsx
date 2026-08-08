import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Plus, SearchX, Sparkles, Users } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { CategoryChips } from "@/components/community/category-chips";
import { CommunityCard, CommunityRow } from "@/components/community/community-card";
import { EmptyState } from "@/components/community/empty-state";
import { SearchField } from "@/components/community/search-field";
import { SectionHeading } from "@/components/community/section-heading";
import { CommunityListSkeleton } from "@/components/community/skeletons";
import { useBriefLoading } from "@/hooks/use-brief-loading";
import { CATEGORIES, COMMUNITIES } from "@/lib/community-data";
import { useCanCreateCommunity, useJoined } from "@/lib/community-store";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Communities — TIAN" },
      {
        name: "description",
        content:
          "Discover and join Award communities for leadership, expeditions, alumni, study, sustainability, centres and technology.",
      },
      { property: "og:title", content: "Communities — TIAN" },
      {
        property: "og:description",
        content: "Groups and centres across the International Award network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityFeed,
});

function CommunityFeed() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const joinedIds = useJoined();
  const canCreate = useCanCreateCommunity();
  const loading = useBriefLoading();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMUNITIES.filter(
      (c) =>
        (!category || c.category === category) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const joined = filtered.filter((c) => joinedIds.includes(c.id));
  const discover = filtered.filter((c) => !joinedIds.includes(c.id));
  const searching = query.trim().length > 0 || category !== null;

  return (
    <AppScreen>
      <header className="rounded-b-3xl bg-navy-gradient px-5 pb-6 pt-8 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[22px] font-extrabold tracking-tight text-primary-foreground">
              Communities
            </h1>
            <p className="mt-1 text-[13px] text-primary-foreground/70">
              Find your people across the Award network.
            </p>
          </div>
          {canCreate ? (
            <Link
              to="/community/create-post"
              search={{ community: undefined }}
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground shadow-soft transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-foreground/30"
              aria-label="Create a post"
            >
              <Plus className="size-5" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        <SearchField
          value={query}
          onChange={setQuery}
          tone="onNavy"
          label="Search communities"
          placeholder="Search communities"
          className="mt-4"
        />
      </header>

      <div className="mx-auto w-full max-w-2xl">
        <div className="px-5 pt-4">
          <CategoryChips categories={CATEGORIES} value={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="px-5 pt-5">
            <CommunityListSkeleton />
          </div>
        ) : (
          <>
            <section className="px-5 pt-5">
              <SectionHeading
                title="Your communities"
                action={
                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {joined.length} joined
                  </span>
                }
              />
              {joined.length ? (
                <ul className="space-y-2.5">
                  {joined.map((c, i) => (
                    <CommunityRow
                      key={c.id}
                      community={c}
                      style={{ animationDelay: `${i * 45}ms` }}
                    />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={Users}
                  title={searching ? "No joined communities here" : "You haven't joined any yet"}
                  copy={
                    searching
                      ? "None of your communities match this search or filter."
                      : "Join a community below to see its posts, members and updates in one place."
                  }
                />
              )}
            </section>

            <section className="px-5 pt-6">
              <SectionHeading
                title={searching ? "Results" : "Featured for you"}
                action={
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-gold-foreground">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    {searching ? `${discover.length} found` : "Curated"}
                  </span>
                }
              />
              <div className="space-y-4">
                {discover.map((c, i) => (
                  <CommunityCard key={c.id} community={c} style={{ animationDelay: `${i * 60}ms` }} />
                ))}
                {!discover.length ? (
                  <EmptyState
                    icon={searching ? SearchX : Compass}
                    title={searching ? "No communities found" : "Nothing new to discover"}
                    copy={
                      searching
                        ? "Try a different name, category or keyword."
                        : "You've joined every community in the network. More are on the way."
                    }
                    action={
                      searching ? (
                        <button
                          type="button"
                          onClick={() => {
                            setQuery("");
                            setCategory(null);
                          }}
                          className="min-h-11 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform duration-200 active:scale-95"
                        >
                          Clear filters
                        </button>
                      ) : null
                    }
                  />
                ) : null}
              </div>
            </section>
          </>
        )}

        {canCreate ? (
          <div className="px-5 pb-2 pt-6">
            <Link
              to="/community/create-post"
              search={{ community: undefined }}
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary-soft text-[14px] font-bold text-primary transition-transform duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create a post
            </Link>
          </div>
        ) : null}
      </div>
    </AppScreen>
  );
}
