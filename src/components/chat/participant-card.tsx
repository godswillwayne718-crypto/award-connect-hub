import { MapPin } from "lucide-react";
import type { ChatParticipant } from "@/lib/chat-data";
import { ChatAvatar, VerifiedMark } from "@/components/chat/chat-avatar";
import { Button } from "@/components/ui/button";

/**
 * Directory result card. Deliberately shows Award context only — never email
 * addresses or phone numbers.
 */
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
    <li
      className="animate-fade-up rounded-3xl border border-border bg-card p-3.5 shadow-soft"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="flex items-center gap-3">
        <ChatAvatar name={participant.name} online={participant.online} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5">
            <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
              {participant.name}
            </span>
            {participant.verified ? <VerifiedMark /> : null}
          </p>
          <p className="truncate text-[11.5px] font-semibold text-primary/70">
            @{participant.username}
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {participant.country}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
          {participant.role}
        </span>
        {participant.level ? (
          <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
            {participant.level}
          </span>
        ) : null}
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {participant.verified ? "Verified" : "Unverified"}
        </span>
        <Button
          size="sm"
          variant="default"
          className="ml-auto h-11 rounded-full px-4 text-xs"
          onClick={() => onStartChat(participant)}
        >
          Start Chat
        </Button>
      </div>
    </li>
  );
}
