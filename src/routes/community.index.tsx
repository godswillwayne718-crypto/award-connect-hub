import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { CategoryChips } from "@/components/community/category-chips";
import { CommunityCard, CommunityRow } from "@/components/community/community-card";
import { SearchField } from "@/components/community/search-field";
import { SectionHeading } from "@/components/community/section-heading";
import { CATEGORIES, COMMUNITIES } from "@/lib/community-data";
import { useCanCreateCommunity, useJoined } from "@/lib/community-store";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Communities — TIAN" },
      {
        name: "description",
        content:
          "Discover and join Award communities for leaders, expeditions, alumni, study and sustainability.",
      },
      { property: "og:title", content: "Communities — TIAN" },
      {
        property: "og:description",
        content: "Groups and centres across the International Award network.",
      },
    ],
  }),
  component: CommunityFeed,
});

function CommunityFeed() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const joinedIds = useJoined();
  const canCreate = useCanCreateCommunity();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMUNITIES.filter(
      (c) =>
        (!category || c.category === category) &&
        (!q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const joined = filtered.filter((c) => joinedIds.includes(c.id));
  const discover = filtered.filter((c) => !joinedIds.includes(c.id));

  return (
    <AppScreen>
      <header className="rounded-b-3xl bg-navy-gradient px-5 pb-6 pt-8 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div>
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
              className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground shadow-soft transition-transform duration-200 active:scale-95"
              aria-label="Create a community"
            >
              <Plus className="size-5" />
            </Link>
          ) : null}
        </div>
        <SearchField
          value={query}
          onChange={setQuery}
          tone="onNavy"
          placeholder="Search communities"
          className="mt-4"
        />
      </header>

      <div className="px-5 pt-4">
        <CategoryChips categories={CATEGORIES} value={category} onChange={setCategory} />
      </div>

      {joined.length ? (
        <section className="px-5 pt-5">
          <SectionHeading
            title="Your communities"
            action={
              <span className="text-[12px] font-semibold text-muted-foreground">
                {joined.length} joined
              </span>
            }
          />
          <div className="space-y-2.5">
            {joined.map((c, i) => (
              <CommunityRow key={c.id} community={c} style={{ animationDelay: `${i * 45}ms` }} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-5 pt-6">
        <SectionHeading
          title="Featured for you"
          action={
            <span className="flex items-center gap-1 text-[12px] font-semibold text-gold-foreground">
              <Sparkles className="size-3.5" />
              Curated
            </span>
          }
        />
        <div className="space-y-4">
          {discover.map((c, i) => (
            <CommunityCard key={c.id} community={c} style={{ animationDelay: `${i * 60}ms` }} />
          ))}
          {!discover.length && !joined.length ? (
            <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No communities match that search yet.
            </p>
          ) : null}
        </div>
      </section>

      {canCreate ? (
        <div className="px-5 pb-2 pt-6">
          <Link
            to="/community/create-post"
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary-soft py-4 text-[14px] font-bold text-primary transition-transform duration-200 active:scale-[0.99]"
          >
            <Plus className="size-4" />
            Create a community
          </Link>
        </div>
      ) : null}
    </AppScreen>
  );
}
