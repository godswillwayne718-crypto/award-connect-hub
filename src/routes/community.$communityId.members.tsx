import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchX, Users } from "lucide-react";
import { EmptyState } from "@/components/community/empty-state";
import { MemberCard } from "@/components/community/member-card";
import { SearchField } from "@/components/community/search-field";
import { MemberListSkeleton } from "@/components/community/skeletons";
import { useBriefLoading } from "@/hooks/use-brief-loading";
import { membersFor } from "@/lib/community-data";

export const Route = createFileRoute("/community/$communityId/members")({
  head: () => ({
    meta: [
      { title: "Community members — TIAN" },
      {
        name: "description",
        content:
          "Browse participants, Award Leaders, assessors and alumni who belong to this Award community.",
      },
      { property: "og:title", content: "Community members — TIAN" },
      { property: "og:description", content: "See who belongs to this Award community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityMembers,
});

function CommunityMembers() {
  const { communityId } = Route.useParams();
  const [query, setQuery] = useState("");
  const loading = useBriefLoading();
  const members = membersFor(communityId);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.username.includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.level ?? "").toLowerCase().includes(q),
    );
  }, [query, members]);

  return (
    <div className="space-y-3">
      <SearchField
        value={query}
        onChange={setQuery}
        label="Search members"
        placeholder="Search by name, role or country"
      />

      {loading ? (
        <MemberListSkeleton />
      ) : members.length ? (
        <>
          <p className="px-1 text-[12px] font-semibold text-muted-foreground" aria-live="polite">
            {results.length} of {members.length} members
          </p>
          {results.length ? (
            <ul className="space-y-3">
              {results.map((m, i) => (
                <MemberCard key={m.id} member={m} style={{ animationDelay: `${i * 35}ms` }} />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No members found"
              copy="No one in this community matches that search."
              action={
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="min-h-11 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform duration-200 active:scale-95"
                >
                  Clear search
                </button>
              }
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No members yet"
          copy="This community is brand new. Join it to become one of the first members."
        />
      )}
    </div>
  );
}
