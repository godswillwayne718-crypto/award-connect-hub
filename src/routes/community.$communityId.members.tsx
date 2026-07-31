import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MemberCard } from "@/components/community/member-card";
import { SearchField } from "@/components/community/search-field";
import { MEMBERS } from "@/lib/community-data";

export const Route = createFileRoute("/community/$communityId/members")({
  component: CommunityMembers,
});

function CommunityMembers() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEMBERS;
    return MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.username.includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <SearchField value={query} onChange={setQuery} placeholder="Search members" />
      <p className="px-1 text-[12px] font-semibold text-muted-foreground">
        {results.length} of {MEMBERS.length} members
      </p>
      {results.map((m, i) => (
        <MemberCard key={m.id} member={m} style={{ animationDelay: `${i * 35}ms` }} />
      ))}
      {!results.length ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No members match that search.
        </p>
      ) : null}
    </div>
  );
}
