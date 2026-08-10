import { Link } from "@tanstack/react-router";
import { ChevronLeft, MoreVertical, Ban, Flag, MinusCircle } from "lucide-react";
import { toast } from "sonner";
import type { ChatParticipant } from "@/lib/chat-data";
import { ChatAvatar, VerifiedMark } from "@/components/chat/chat-avatar";
import {
  reportParticipant,
  toggleBlocked,
  toggleRestricted,
  useIsBlocked,
  useIsRestricted,
} from "@/lib/chat-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Conversation header with presence and the safety menu. */
export function ChatHeader({ participant }: { participant: ChatParticipant }) {
  const blocked = useIsBlocked(participant.id);
  const restricted = useIsRestricted(participant.id);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur">
      <Link
        to="/chats"
        aria-label="Back to chats"
        className="grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <ChatAvatar name={participant.name} online={participant.online} size="md" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5">
          <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
            {participant.name}
          </span>
          {participant.verified ? <VerifiedMark /> : null}
        </p>
        <p className="truncate text-[11.5px] font-semibold text-muted-foreground">
          @{participant.username} · {blocked ? "Blocked" : participant.lastSeen}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Conversation options"
          className="grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <MoreVertical className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-2xl">
          <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Safety
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              toggleBlocked(participant.id);
              toast(blocked ? "Participant unblocked" : "Participant blocked");
            }}
          >
            <Ban className="size-4" /> {blocked ? "Unblock" : "Block"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              toggleRestricted(participant.id);
              toast(restricted ? "Restriction removed" : "Participant restricted");
            }}
          >
            <MinusCircle className="size-4" /> {restricted ? "Unrestrict" : "Restrict"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => {
              reportParticipant(participant.id);
              toast.success("Report sent to the TIAN safety team");
            }}
          >
            <Flag className="size-4" /> Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
