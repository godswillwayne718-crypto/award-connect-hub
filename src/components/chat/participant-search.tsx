import { UserRoundSearch } from "lucide-react";
import type { ChatParticipant } from "@/lib/chat-data";
import { searchParticipants } from "@/lib/chat-data";
import { SearchField } from "@/components/community/search-field";
import { ParticipantCard } from "@/components/chat/participant-card";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";

/** @username directory search used by the New Chat screen. */
export function ParticipantSearch({
  query,
  onQueryChange,
  onStartChat,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onStartChat: (participant: ChatParticipant) => void;
}) {
  const results = searchParticipants(query);

  return (
    <div className="space-y-4">
      <SearchField
        value={query}
        onChange={onQueryChange}
        label="Search Award members by username"
        placeholder="Search @username"
      />

      {results.length === 0 ? (
        <ChatEmptyState
          icon={UserRoundSearch}
          title="No participants found"
          copy="Try searching for another @username."
        />
      ) : (
        <ul className="space-y-2.5">
          {results.map((participant, i) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onStartChat={onStartChat}
              index={i}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
