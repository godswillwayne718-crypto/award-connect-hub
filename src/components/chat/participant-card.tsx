import type { ChatParticipant } from "@/lib/chat-data";
import { ParticipantCard as SharedParticipantCard } from "@/components/shared/participant-card";
import { Button } from "@/components/ui/button";

/** Chat's directory result card: shared card + a Start Chat action. */
export function ParticipantCard({
  participant,
  onStartChat,
  index = 0,
}: {
  participant: ChatParticipant;
  onStartChat: (participant: ChatParticipant) => void;
  index?: number;
}) {
  return (
    <SharedParticipantCard
      person={participant}
      index={index}
      actions={
        <Button
          size="sm"
          variant="default"
          className="h-11 rounded-full px-4 text-xs"
          onClick={() => onStartChat(participant)}
        >
          Start Chat
        </Button>
      }
    />
  );
}
