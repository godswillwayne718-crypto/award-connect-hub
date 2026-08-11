import type { ChatParticipant } from "@/lib/chat-data";
import { ParticipantSearch as SharedParticipantSearch } from "@/components/shared/participant-search";
import { Button } from "@/components/ui/button";

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
  return (
    <SharedParticipantSearch
      query={query}
      onQueryChange={onQueryChange}
      label="Search Award members by username"
      placeholder="Search @username"
      renderActions={(person) => (
        <Button
          size="sm"
          variant="default"
          className="h-11 rounded-full px-4 text-xs"
          onClick={() => onStartChat(person)}
        >
          Start Chat
        </Button>
      )}
    />
  );
}
