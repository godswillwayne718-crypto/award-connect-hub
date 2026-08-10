import { Link } from "@tanstack/react-router";
import type { Chat } from "@/lib/chat-data";
import { participantOf, lastMessage } from "@/lib/chat-store";
import { formatChatStamp } from "@/lib/chat-format";
import { ChatAvatar, VerifiedMark } from "@/components/chat/chat-avatar";
import { ME } from "@/lib/chat-data";
import { cn } from "@/lib/utils";

/** One conversation row in the inbox. */
export function ChatRow({ chat, index = 0 }: { chat: Chat; index?: number }) {
  const participant = participantOf(chat);
  if (!participant) return null;
  const last = lastMessage(chat);
  const preview = last
    ? `${last.authorId === ME ? "You: " : ""}${last.body}`
    : "Say hello to start the conversation";

  return (
    <li className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <Link
        to="/chats/$chatId"
        params={{ chatId: chat.id }}
        className="flex min-h-[72px] items-center gap-3 rounded-3xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <ChatAvatar name={participant.name} online={participant.online} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
              {participant.name}
            </span>
            {participant.verified ? <VerifiedMark /> : null}
            <span className="ml-auto shrink-0 pl-2 text-[11px] font-semibold text-muted-foreground">
              {formatChatStamp(last ? last.sentAt : chat.createdAt)}
            </span>
          </span>
          <span className="block truncate text-[11.5px] font-semibold text-primary/70">
            @{participant.username}
          </span>
          <span className="mt-0.5 flex items-center gap-2">
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px]",
                chat.unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {preview}
            </span>
            {chat.unread > 0 ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {chat.unread}
              </span>
            ) : null}
          </span>
        </span>
      </Link>
    </li>
  );
}
