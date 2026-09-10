import { Link } from "@tanstack/react-router";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { VerifiedMark } from "@/components/shared/username-badge";
import { formatChatStamp } from "@/lib/chat-format";
import { nameOf } from "@/lib/identity";
import type { InboxEntry } from "@/lib/messaging";
import { cn } from "@/lib/utils";

function previewOf(entry: InboxEntry, me: string) {
  const last = entry.lastMessage;
  if (!last) return "Say hello to start the conversation";
  const prefix = last.sender_id === me ? "You: " : "";
  if (last.kind === "voice") return `${prefix}Voice note`;
  if (last.kind === "call") return last.body || "Call";
  return `${prefix}${last.body}`;
}

/** One backend conversation in the inbox. */
export function InboxRow({
  entry,
  me,
  index = 0,
}: {
  entry: InboxEntry;
  me: string;
  index?: number;
}) {
  const { other, conversation, unread } = entry;

  return (
    <li className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <Link
        to="/chats/$chatId"
        params={{ chatId: conversation.id }}
        className="flex min-h-[72px] items-center gap-3 rounded-3xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <PersonAvatar name={nameOf(other)} online={other.online} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
              {nameOf(other)}
            </span>
            {other.verified ? <VerifiedMark /> : null}
            <span className="ml-auto shrink-0 pl-2 text-[11px] font-semibold text-muted-foreground">
              {formatChatStamp(entry.lastMessage?.created_at ?? conversation.last_message_at)}
            </span>
          </span>
          <span className="block truncate text-[11.5px] font-semibold text-primary/70">
            @{other.username}
          </span>
          <span className="mt-0.5 flex items-center gap-2">
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px]",
                unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {previewOf(entry, me)}
            </span>
            {unread > 0 ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {unread}
              </span>
            ) : null}
          </span>
        </span>
      </Link>
    </li>
  );
}
