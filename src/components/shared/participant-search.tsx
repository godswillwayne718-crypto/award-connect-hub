import type { ReactNode } from "react";
import { UserRoundSearch } from "lucide-react";
import { SearchField } from "@/components/community/search-field";
import { EmptyState } from "@/components/community/empty-state";
import { ParticipantCard } from "@/components/shared/participant-card";
import { searchPeople, type Person } from "@/lib/people-data";
import { useBlockedIds } from "@/lib/chat-store";

/**
 * Reusable "Find People" experience: search the TIAN directory by name or
 * @username. Callers decide which action each result exposes.
 */
export function ParticipantSearch({
  query,
  onQueryChange,
  pool,
  renderActions,
  label = "Search Award members by name or @username",
  placeholder = "Search name or @username",
  emptyTitle = "No participants found",
  emptyCopy = "Try searching for another @username.",
}: {
  query: string;
  onQueryChange: (v: string) => void;
  pool?: Person[];
  renderActions?: (person: Person) => ReactNode;
  label?: string;
  placeholder?: string;
  emptyTitle?: string;
  emptyCopy?: string;
}) {
  const results = searchPeople(query, pool);

  return (
    <div className="space-y-4">
      <SearchField
        value={query}
        onChange={onQueryChange}
        label={label}
        placeholder={placeholder}
      />

      {results.length === 0 ? (
        <EmptyState icon={UserRoundSearch} title={emptyTitle} copy={emptyCopy} />
      ) : (
        <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((person, i) => (
            <ParticipantCard
              key={person.id}
              person={person}
              index={i}
              actions={renderActions?.(person)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
