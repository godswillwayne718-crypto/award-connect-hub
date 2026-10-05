import type { ReactNode } from "react";
import { UserRoundSearch } from "lucide-react";
import { SearchField } from "@/components/community/search-field";
import { EmptyState } from "@/components/community/empty-state";
import { ProfileRow } from "@/components/shared/profile-row";
import { useAuth } from "@/lib/auth";
import { useBlocked } from "@/lib/social";
import { useProfileSearch, type Profile } from "@/lib/directory";

/** Searches every registered TIAN member in the shared backend directory. */
export function PeopleFinder({
  query,
  onQueryChange,
  renderActions,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  renderActions: (p: Profile) => ReactNode;
}) {
  const { userId, profile } = useAuth();
  const blocked = useBlocked(userId).data ?? [];
  const exclude = userId ? [userId, ...blocked] : blocked;
  const search = useProfileSearch(query, exclude);
  const results = search.data ?? [];

  return (
    <div className="space-y-4">
      {profile ? (
        <p className="rounded-2xl bg-primary-soft px-4 py-3 text-[12.5px] text-primary">
          Your username is <strong>@{profile.username}</strong> — share it so others can find you.
        </p>
      ) : null}
      <SearchField
        value={query}
        onChange={onQueryChange}
        label="Search TIAN members by name or @username"
        placeholder="Search name or @username"
      />
      {search.query.length < 2 ? (
        <EmptyState
          icon={UserRoundSearch}
          title="Find people on TIAN"
          copy="Type at least 2 letters of a name or @username."
        />
      ) : search.isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Searching…</p>
      ) : search.isError ? (
        <EmptyState icon={UserRoundSearch} title="Search failed" copy="Check your connection and try again." />
      ) : results.length === 0 ? (
        <EmptyState
          icon={UserRoundSearch}
          title="No one found"
          copy={`No TIAN member matches “${search.query}”.`}
        />
      ) : (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {results.map((p) => (
            <ProfileRow key={p.id} profile={p} actions={renderActions(p)} />
          ))}
        </ul>
      )}
    </div>
  );
}
